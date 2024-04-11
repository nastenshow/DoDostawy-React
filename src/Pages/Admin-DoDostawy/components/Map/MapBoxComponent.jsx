import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faPen } from "@fortawesome/free-solid-svg-icons";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
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

const MapBoxComponent = ({
  coordinates,
  restaurantName,
  onMarkerDragEnd,
  restaurantId,
  rzeszowCoordinates,
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

  useEffect(() => {
    const group = new L.FeatureGroup();
    setEditableLayers(group);
  }, []);

 
  const customMarkerIcon = L.icon({
    iconUrl: '/marker-icon-2x.png', // Замініть цей шлях шляхом до вашого зображення
    iconSize: [25, 41], // Розміри зображення маркера
    iconAnchor: [12, 41], // Точка, від якої іконка вважатиметься "прикріпленою" до карти
    popupAnchor: [-3, -76] // Точка, від якої буде відображатись спливаюче вікно
  });

  const updatePolygons = (restaurantId, polygons) => {
    const token = decryptToken(encryptedToken);
 
    axios
      .put(
        `${apiUrl}api/restaurants-map/${restaurantId}/polygons`,
        {
          polygon: JSON.stringify(polygons),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {

      })
      .catch((error) => {
        console.error("Error updating polygons:", error.response.data);
      });
  };

  const onCreated = (e) => {
    console.log("onCreated called", e);
    const { layerType, layer } = e;
  
    // Переконаймося, що створюється лише полігон
    if (layerType === "polygon") {
      // Видалення існуючих полігонів перед додаванням нового
      editableLayersRef.current.clearLayers();
  
      // Додавання нового полігону до шару для редагування
      editableLayersRef.current.addLayer(layer);
  
      const polygonCoordinates = layer.getLatLngs()[0].map((latLng) => ({
        lat: latLng.lat,
        lng: latLng.lng,
      }));
      console.log("Polygon coordinates:", polygonCoordinates);
  
      if (restaurantId) {
        updatePolygons(restaurantId, polygonCoordinates);
      } else {
        console.error("Error: No restaurantId provided");
      }
    }
  };

  console.log(restaurantId)


  useEffect(() => {
    const fetchRestaurantPolygon = async () => {
      if (!restaurantId) return; // Вихід, якщо restaurantId не встановлено
      
  
      const token = decryptToken(encryptedToken);
      if (!token) {
        console.error("Authentication token is not available");
        return;
      }
  
      try {
        const response = await axios.get(`${apiUrl}api/restaurants-map/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data && response.data.polygon) {
          editableLayersRef.current.clearLayers(); // Очищення існуючих полігонів
  
          const polygonCoordinates = JSON.parse(response.data.polygon);
          const polygon = L.polygon(polygonCoordinates.map(({ lat, lng }) => [lat, lng]), {
            color: '#212529',
            weight: 2,
          }).addTo(editableLayersRef.current);
  
          if (mapRef.current) {
            mapRef.current.fitBounds(polygon.getBounds()); // Центрування мапи за межами полігону
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant polygon:', error);
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

  const onEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      // Припускаємо, що редагувалися полігони, отже отримуємо їх координати
      const editedPolygonCoordinates = layer.getLatLngs()[0].map((latLng) => ({
        lat: latLng.lat,
        lng: latLng.lng,
      }));
      console.log("Edited polygon coordinates:", editedPolygonCoordinates);
  
      // Відправка оновлених координат на сервер
      if (restaurantId) {
        updatePolygons(restaurantId, editedPolygonCoordinates);
      } else {
        console.error("Error: No restaurantId provided for the updated polygon.");
      }
    });
  };

  const onDeleted = (e) => {
    const { layers: { _layers } } = e;
  
    // Перевіряємо, чи видаляється полігон
    if (Object.keys(_layers).length > 0) {
      // Якщо так, оновлюємо дані полігону в базі даних, відправляючи null
      updatePolygonsWithNull(restaurantId);
    }
  };
  
  const updatePolygonsWithNull = (restaurantId) => {
    const token = decryptToken(encryptedToken);
    axios.put(
      `${apiUrl}api/restaurants-map/${restaurantId}/polygons`,
      JSON.stringify({ polygon: "0" }), // Використовуємо JSON.stringify для формування тіла запиту
      {
        headers: {
          'Content-Type': 'application/json', // Додаємо заголовок Content-Type
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log("Polygons updated to null:", response.data);
    })
    .catch((error) => {
      console.error("Error updating polygons to null:", error.response.data);
    });
  };
  

  


  

  return (
    <div className={`map-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {isFullscreen && <div className="sidebar">Sidebar content here</div>}
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={13}
        style={{ height: '40vh', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          if (editableLayers) {
            editableLayers.addTo(mapInstance);
          }
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
            dragend: updateMarkerPosition,
          }}
        >
          <Popup>{restaurantName || "Wpisz nazwę restauracji"} </Popup>
        </Marker>
        <FeatureGroup ref={editableLayersRef}>
          <EditControl
            position="topright"
            onEdited={onEdited}
            onDeleted={onDeleted}
            onCreated={onCreated}
            draw={{
              polyline: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: true,
            }}
            edit={{ featureGroup: editableLayersRef.current }}
          />
        </FeatureGroup>
        <FullscreenControl />
      </MapContainer>
    </div>
  );
};

export default MapBoxComponent;
