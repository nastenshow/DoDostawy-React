import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  useMap,
  Polyline,
} from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faPen } from "@fortawesome/free-solid-svg-icons";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import { point as turfPoint, polygon as turfPolygon } from "@turf/helpers";

import "../../../assets/MapBoxComponent.css";

import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const encryptedToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
  "$1"
);

const decryptToken = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    const fullscreenControl = new L.Control.Fullscreen({
      title: "Pokaż pełny ekran",
      titleCancel: "Wyjdź z trybu pełnoekranowego",
      position: "topright",
    });
    map.addControl(fullscreenControl);
    return () => map.removeControl(fullscreenControl);
  }, [map]);

  return null;
};

const MapBoxComponentRoute = ({
  coordinates,
  restaurantName,
  secondCoordinates,
  onMarkerDragEnd,
  setDistance,
  setOutsideDistance,
  restaurantId,
  rzeszowCoordinates,
  street, // отримання вулиці
  city, // отримання міста
  house_number, // отримання номеру будинку
}) => {
  const validCoordinates =
    coordinates &&
    coordinates.lat !== undefined &&
    coordinates.lng !== undefined;
  const defaultCoordinates = { lat: 0, lng: 0 }; // Fallback coordinates if none provided
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [mapCenter, setMapCenter] = useState(rzeszowCoordinates);
  const [markerPosition, setMarkerPosition] = useState(rzeszowCoordinates);
  const mapRef = useRef(null);
  const [polygonLayer, setPolygonLayer] = useState(null);
  const [editableLayers, setEditableLayers] = useState(null);
  const editableLayersRef = useRef(new L.FeatureGroup());
  const [secondMarkerPosition, setSecondMarkerPosition] =
    useState(secondCoordinates);
  const [isFetching, setIsFetching] = useState(false);
  const [route, setRoute] = useState(null);
  const [outsideRoute, setOutsideRoute] = useState([]);

  const [outsideDistance, setOutsideDistanceLocal] = useState(0);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [leafletPolygonCoordinates, setLeafletPolygonCoordinates] = useState(
    []
  );
  

  const fetchRoute = async () => {
    // Замініть 'YOUR_OPENROUTESERVICE_API_KEY' на ваш дійсний API-ключ
      const apiKey = "5b3ce3597851110001cf62481dffc603d0ba416ba78d1c4bbb39d8ad";
  // Запасний API-ключ
      const backupApiKey = "5b3ce3597851110001cf62485dd72ac964574be88e60d4b2a23f1470";

      const baseUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
      const query = `?start=${markerPosition.lng},${markerPosition.lat}&end=${secondMarkerPosition.lng},${secondMarkerPosition.lat}`;

  // Функція для виконання запиту
  const makeRequest = async (key) => {
    const url = `${baseUrl}${query}&api_key=${key}`;
    const response = await axios.get(url);
    return response;
  };

  try {
    // Спроба виконати запит з основним ключем
    const response = await makeRequest(apiKey);
    processRoute(response);
  } catch (error) {
    console.error("Error with primary API key:", error);
    try {
      // Спроба виконати запит з запасним ключем
      const backupResponse = await makeRequest(backupApiKey);
      processRoute(backupResponse);
    } catch (backupError) {
      console.error("Error with backup API key:", backupError);
    }
  }
};

// Функція для обробки отриманих даних маршруту
const processRoute = (response) => {
  const { features } = response.data;
  const coordinates = features[0].geometry.coordinates;

  const latLngs = coordinates.map((coord) => [coord[1], coord[0]]);
  setRoute(latLngs);

  let routeDistance = 0;
  for (let i = 1; i < latLngs.length; i++) {
    routeDistance += L.latLng(latLngs[i - 1]).distanceTo(L.latLng(latLngs[i]));
  }

  const distanceInKilometers = (routeDistance / 1000).toFixed(1);
  setDistance(distanceInKilometers);
};

  useEffect(() => {
    if (markerPosition && secondMarkerPosition) {
      fetchRoute();
    }
  }, [markerPosition, secondMarkerPosition]);

  useEffect(() => {
    if (markerPosition && secondMarkerPosition) {
      const pointA = L.latLng(markerPosition.lat, markerPosition.lng);
      const pointB = L.latLng(
        secondMarkerPosition.lat,
        secondMarkerPosition.lng
      );
      const distanceInMeters = pointA.distanceTo(pointB);
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(1);

      setDistance(distanceInKilometers); // Update the distance in the parent component
   
    }
  }, [markerPosition, secondMarkerPosition]);

  useEffect(() => {
    // Ensure that secondCoordinates is not null or undefined before updating the state
    if (
      secondCoordinates &&
      secondCoordinates.lat !== undefined &&
      secondCoordinates.lng !== undefined
    ) {
      setSecondMarkerPosition(secondCoordinates);
    }
  }, [secondCoordinates]);

  const customMarkerIcon = L.icon({
    iconUrl: "/marker-icon-2x.png", // Замініть цей шлях шляхом до вашого зображення
    iconSize: [25, 41], // Розміри зображення маркера
    iconAnchor: [12, 41], // Точка, від якої іконка вважатиметься "прикріпленою" до карти
    popupAnchor: [-3, -76], // Точка, від якої буде відображатись спливаюче вікно
  });

  const customMarkerIconEnd = L.icon({
    iconUrl: "/marker-icon-2x-end.png", // Замініть цей шлях шляхом до вашого зображення
    iconSize: [25, 41], // Розміри зображення маркера
    iconAnchor: [12, 41], // Точка, від якої іконка вважатиметься "прикріпленою" до карти
    popupAnchor: [-3, -76], // Точка, від якої буде відображатись спливаюче вікно
  });

  useEffect(() => {
    const group = new L.FeatureGroup();
    setEditableLayers(group);
  }, []);

  useEffect(() => {
    const fetchRestaurantPolygon = async () => {
      if (!restaurantId) return;

      const token = decryptToken(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      );

      try {
        const response = await axios.get(
          `${apiUrl}api/restaurants-map/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.polygon) {
          editableLayersRef.current.clearLayers();

          const polygonData = JSON.parse(response.data.polygon);

          // Check if the first and last coordinates are the same. If not, make them.
          if (
            polygonData.length > 0 &&
            (polygonData[0].lat !== polygonData[polygonData.length - 1].lat ||
              polygonData[0].lng !== polygonData[polygonData.length - 1].lng)
          ) {
            polygonData.push(polygonData[0]);
          }

          // Convert polygonData to the format Leaflet expects: [[lat, lng], [lat, lng], ...]
          const leafletPolygonCoordinates = polygonData.map((coord) => [
            coord.lat,
            coord.lng,
          ]);

          // Now leafletPolygonCoordinates is ready to be used for creating a Leaflet polygon
          const polygon = L.polygon(leafletPolygonCoordinates, {
            color: "#212529",
            weight: 2,
          }).addTo(editableLayersRef.current);

          // Set the polygon in state if needed
          setPolygonLayer(polygon);

          setLeafletPolygonCoordinates(leafletPolygonCoordinates);
        }
      } catch (error) {
        
      }
    };

    fetchRestaurantPolygon();
  }, [restaurantId]);

  useEffect(() => {
    setMarkerPosition(coordinates);
  }, [coordinates]);

  const handleFullscreenChange = () => {
    setIsFullscreen(mapInstance.isFullscreen());
  };

  useEffect(() => {
    // Отримуємо іконку пера з FontAwesome
    const penIcon = L.divIcon({
      html: `<span class="icon"><i class="fas fa-pen"></i></span>`,
      className: "dummy",
    });

    // Використовуємо іконку пера для кнопки малювання полігону
    L.drawLocal.draw.toolbar.buttons.polygon = "Draw a polygon"; // Tooltip text
    document.querySelectorAll(".leaflet-draw-draw-polygon").forEach((btn) => {
      btn.getElementsByClassName("leaflet-draw-toolbar-icon")[0].innerHTML =
        '<i class="fas fa-pen"></i>';
    });
  }, []);

  const updateMarkerPosition = (event) => {
    const { lat, lng } = event.target.getLatLng();
    // Call the passed in onMarkerDragEnd function with the new coordinates
    onMarkerDragEnd(lat, lng);
  };

  useEffect(() => {
    if (mapRef.current && polygonLayer) {
      // This ensures that the polygon layer is part of the editable layers
      editableLayers.addLayer(polygonLayer);
      mapRef.current.addLayer(editableLayers); // Add editableLayers to the map
      editableLayers.addTo(mapRef.current);
      // Fit the map to the polygon bounds
      const bounds = polygonLayer.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [polygonLayer]);

  useEffect(() => {
    L.drawLocal.draw.toolbar.buttons.polygon = "Narysuj wielokąt";
    L.drawLocal.draw.handlers.polygon.tooltip.start =
      "Kliknij, aby zacząć rysować wielokąt.";
    L.drawLocal.draw.handlers.polygon.tooltip.cont =
      "Kliknij, aby kontynuować rysowanie wielokąta.";
    L.drawLocal.draw.handlers.polygon.tooltip.end =
      "Kliknij pierwszy punkt, aby zamknąć ten wielokąt.";
    L.drawLocal.edit.toolbar.buttons.edit = "Edytuj warstwy";
    L.drawLocal.edit.toolbar.buttons.editDisabled = "Brak warstw do edycji";
    L.drawLocal.edit.toolbar.buttons.remove = "Usuń warstwy";
    L.drawLocal.edit.toolbar.buttons.removeDisabled =
      "Brak warstw do usunięcia";
    L.drawLocal.draw.toolbar.actions.title = "Anuluj rysowanie";
    L.drawLocal.draw.toolbar.actions.text = "Anuluj";
    L.drawLocal.draw.toolbar.finish.title = "Zakończ rysowanie";
    L.drawLocal.draw.toolbar.finish.text = "Zakończ";
    L.drawLocal.draw.toolbar.undo.title = "Usuń ostatni punkt";
    L.drawLocal.draw.toolbar.undo.text = "Usuń ostatni punkt";
    L.drawLocal.edit.toolbar.actions.save.title = "Zapisz zmiany";
    L.drawLocal.edit.toolbar.actions.save.text = "Zapisz";
    L.drawLocal.edit.toolbar.actions.cancel.title =
      "Anuluj edycję, odrzuć wszystkie zmiany";
    L.drawLocal.edit.toolbar.actions.cancel.text = "Anuluj";
    L.drawLocal.edit.toolbar.actions.clearAll.title =
      "Wyczyść wszystkie warstwy";
    L.drawLocal.edit.toolbar.actions.clearAll.text = "Wyczyść wszystko";
    L.drawLocal.edit.handlers.remove.tooltip.text =
      "Kliknij na obiekt, aby go usunąć.";

    L.drawLocal.edit.handlers.edit.tooltip.text =
      "Przeciągnij uchwyty lub znaczniki, aby edytować elementy.";
    L.drawLocal.edit.handlers.edit.tooltip.subtext =
      "Kliknij przycisk Anuluj, aby cofnąć zmiany.";

    L.drawLocal.draw.handlers.polyline.error =
      "<strong>Błąd:</strong> krawędzie kształtu nie mogą się krzyżować!";
    L.drawLocal.draw.handlers.polyline.tooltip.start =
      "Kliknij, aby rozpocząć rysowanie linii.";
    L.drawLocal.draw.handlers.polyline.tooltip.cont =
      "Kliknij, aby kontynuować rysowanie linii.";
    L.drawLocal.draw.handlers.polyline.tooltip.end =
      "Kliknij ostatni punkt, aby zakończyć.";

    // ... і так далі для всіх інших текстів

    // Інші ефекти і логіка useEffect
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      const map = mapRef.current.leafletElement;
      const polyline = L.polyline([], { color: "blue", stroke: "black" }).addTo(
        map
      );

      let distance = 0;
      let currentLatLngs = [];

      const animateLine = () => {
        if (distance < route.length) {
          currentLatLngs.push(L.latLng(route[distance][0], route[distance][1]));
          polyline.setLatLngs(currentLatLngs);

          distance++;
          requestAnimationFrame(animateLine);
        }
      };

      animateLine();

      return () => map.removeLayer(polyline);
    }
  }, [route]);

  const calculateOutsideDistance = (route, polygon) => {
    let totalDistanceOutside = 0;
    let segmentDistance = 0;
    let lastPointInside = booleanPointInPolygon(
      turfPoint([route[0][1], route[0][0]]),
      polygon
    );

    for (let i = 1; i < route.length; i++) {
      const currentPoint = route[i];
      const currentPointInside = booleanPointInPolygon(
        turfPoint([currentPoint[1], currentPoint[0]]),
        polygon
      );

      if (!currentPointInside) {
        const lastPoint = route[i - 1];
        segmentDistance = L.latLng(lastPoint[0], lastPoint[1]).distanceTo(
          L.latLng(currentPoint[0], currentPoint[1])
        );
        totalDistanceOutside += segmentDistance;
      }

      lastPointInside = currentPointInside;
    }

    return totalDistanceOutside / 1000; // Return distance in kilometers
  };

 

  const updateStreetCoordinatesInDB = async (lat, lng) => {
    // Використовуйте отримані пропси street, city, і house_number разом з lat, lng
    const token = decryptToken(encryptedToken);

    try {
      await axios.put(
        `${apiUrl}api/update-street-coordinates`,
        {
          street,
          city,
          house_number: house_number,
          lat: lat,
          lon: lng,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
    } catch (error) {
    }
  };

  // Використовуйте цю функцію в обробнику dragend маркера
  {
    dragend: (event) => {
      const newSecondMarkerPosition = event.target.getLatLng();
      setSecondMarkerPosition(newSecondMarkerPosition);
      updateStreetCoordinatesInDB(
        newSecondMarkerPosition.lat,
        newSecondMarkerPosition.lng
      );
    };
  }

  useEffect(() => {
    const checkRoute = async () => {
      if (
        !markerPosition ||
        !secondMarkerPosition ||
        !leafletPolygonCoordinates ||
        !route ||
        leafletPolygonCoordinates.length === 0 ||
        route.length === 0
      ) {
        return; // Вихід, якщо ще не все завантажено
      }

      const convertedLeafletPolygonCoordinates = leafletPolygonCoordinates.map(
        (coord) => [coord[1], coord[0]]
      );
      const polygon = turfPolygon([convertedLeafletPolygonCoordinates]);

      // Initialize outside distance to 0
      let totalDistanceOutside = 0;
      let segmentDistanceOutside = 0;
      let lastPointInside = booleanPointInPolygon(
        turfPoint([route[0][1], route[0][0]]),
        polygon
      );

      // Loop through each segment of the route
      for (let i = 1; i < route.length; i++) {
        const currentPoint = route[i];
        const currentPointInside = booleanPointInPolygon(
          turfPoint([currentPoint[1], currentPoint[0]]),
          polygon
        );

        // If the current point is outside, add the distance from the last point to the current point
        if (!currentPointInside) {
          const lastPoint = route[i - 1];
          segmentDistanceOutside += L.latLng(
            lastPoint[0],
            lastPoint[1]
          ).distanceTo(L.latLng(currentPoint[0], currentPoint[1]));
        }

        // If the current point is inside and the last point was outside, add the segment distance to the total
        if (currentPointInside && !lastPointInside) {
          totalDistanceOutside += segmentDistanceOutside;
          segmentDistanceOutside = 0; // Reset segment distance as we're back inside
        }

        lastPointInside = currentPointInside;
      }

      // If the last segment of the route was outside the polygon, add it to the total
      if (!lastPointInside) {
        totalDistanceOutside += segmentDistanceOutside;
      }

      // Convert meters to kilometers and update state
      setOutsideDistance(totalDistanceOutside / 1000); // This is the local setState call
    };

    checkRoute();
  }, [markerPosition, secondMarkerPosition, leafletPolygonCoordinates, route]);

  // Викликаємо fetchRoute коли компонент монтується чи координати маркерів змінюються

  return (
    <div className={`map-wrapper ${isFullscreen ? "fullscreen" : ""}`}>
      {isFullscreen && <div className="sidebar">Sidebar content here</div>}
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={13}
        style={{ height: "40vh", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={markerPosition}
          draggable={false}
          icon={customMarkerIcon}
          eventHandlers={{
            dragend: (event) => {
              const newSecondMarkerPosition = event.target.getLatLng();
              setSecondMarkerPosition(newSecondMarkerPosition);
              updateStreetCoordinatesInDB(
                street,
                city,
                house_number,
                newSecondMarkerPosition.lat,
                newSecondMarkerPosition.lng
              );
            },
          }}
        >
          <Popup></Popup>
        </Marker>

        {secondMarkerPosition && (
           <Marker
           position={secondMarkerPosition}
           // Встановлюємо маркер як пересувний тільки якщо street, city та house_number мають значення
           draggable={!!(street && city && house_number)}
           icon={customMarkerIconEnd}
           eventHandlers={{
            dragend: (event) => {
              // Якщо всі дані заповнені, дозволяємо оновлення координат
              if (street && city && house_number) {
                const newLatLng = event.target.getLatLng();
                setSecondMarkerPosition(newLatLng);
                updateStreetCoordinatesInDB(
                  newLatLng.lat, // Правильно передаємо широту
                  newLatLng.lng // Правильно передаємо довготу
                );
              }
            },
           }}
         >
           <Popup>
             {/* Ваш контент для спливаючого вікна, якщо потрібно */}
           </Popup>
         </Marker>
        )}

        <FeatureGroup ref={editableLayersRef}>
          <EditControl
            position="topright"
            draw={{
              polyline: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: false,
            }}
            edit={{
              featureGroup: editableLayersRef.current,
              edit: false,
              remove: false, // Сховати функцію видалення
            }}
          />
        </FeatureGroup>
        <FullscreenControl />
        {route && <Polyline positions={route} className="route-inside" />}
        {outsideRoute.length > 0 && (
          <Polyline
            positions={outsideRoute}
            className="route-outside"
            color="rgb(0, 141, 206)"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapBoxComponentRoute;
