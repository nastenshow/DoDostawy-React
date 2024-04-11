import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import MapBoxComponentRoute from "../Map/MapBoxComponentRoute.jsx";
import CitySelector from "../Map/CitySelector.jsx";
import StreetSelector from "../Map/StreetSelector.jsx";
import NumerBudynku from "../Map/NumerBudynku.jsx";

import axios from "axios";

const apiUrl = import.meta.env.VITE_LINK;

function generateTimeOptions() {
  const options = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = String(i).padStart(2, "0");
      const minutes = String(j).padStart(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  return options;
}

function ModalComponent({ isModalVisible, setModalVisible }) {
  const [status, setStatus] = useState("");

  const [deliveryTime, setDeliveryTime] = useState(
    "Tak szybko, jak to możliwe"
  );
  const [orderSize, setOrderSize] = useState("1");
  const [value, setValue] = useState("0,00 zł");
  const [apartment_number, setApartmentNumber] = useState("");
  const [city, setCity] = useState("Rzeszów");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [house_number, sethouse_number] = useState("");
  const [rateUpTo6km, setRateUpTo6km] = useState("");
  const [rateAbove6km, setRateAbove6km] = useState("");
  const [kilometry, setKilometry] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [rateOutsideZone, setRateOutsideZone] = useState("");
  const [markerCoordinates, setMarkerCoordinates] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });
  const [markerCoordinatesfirst, setMarkerCoordinatesfirst] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });
  const [secondMarkerPosition, setSecondMarkerPosition] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });
  const [distance, setDistance] = useState("");

  const kilometryWithComma = distance.toString().replace(".", ",");
  const [outsideDistance, setOutsideDistance] = useState(0);

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const handleSetOutsideDistance = (distance) => {
    setOutsideDistance(distance);
    // Here you can also convert the distance to string and replace '.' with ',' if needed
    // Then you could pass it directly to the input field or wherever it's needed
  };

  // Отримуємо ключ для дешифрування з змінних середовища
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  // Функція для дешифрування токену
  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleBlur = (e) => {
    let inputVal = e.target.value.replace(" zł", "").replace(",", ".");
    let floatValue = parseFloat(inputVal);

    if (!isNaN(floatValue)) {
      setValue(floatValue.toFixed(2).replace(".", ",") + " zł");
    } else {
      setValue("0,00 zł");
    }
  };

  const updateMapCoordinates = async (streetName, house_number) => {
    try {
      const token = decryptToken(encryptedToken);
      const url = `${apiUrl}api/street-coordinates?street=${encodeURIComponent(
        streetName
      )}&city=${encodeURIComponent(city)}&house_number=${encodeURIComponent(
        house_number
      )}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        setSecondMarkerPosition({
          lat: parseFloat(response.data.data.lat),
          lng: parseFloat(response.data.data.lon),
        });
      } else {

      }
    } catch (error) {
      if (error.response && error.response.status === 404) {

      } else {
        // Обробляємо інші помилки
        console.error("Error fetching coordinates from database:", error);
      }
    }
  };

  useEffect(() => {
    if (street && house_number) {
      // Додано перевірку на наявність номера будинку
      updateMapCoordinates(street, house_number);
    }
  }, [street, city, house_number]);

  useEffect(() => {
    // Очищаємо house_number при зміні street
    sethouse_number("");
  }, [street]);

  useEffect(() => {
    const fetchInitialCoordinates = async () => {
      if (!selectedRestaurant || !selectedRestaurant.id) return;

      const token = decryptToken();
      if (!token) {
        console.error("Authentication token is not available");
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}api/restaurants-map-touch/${selectedRestaurant.id}/coordinates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.coordinates) {
          // Тут використовуємо response.data.coordinates для доступу до координат
          const { lat, lon } = response.data.coordinates;
          setMarkerCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.error("Invalid coordinates data received from server");
        }
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
      }
    };

    fetchInitialCoordinates();
  }, [selectedRestaurant, apiUrl]);

  useEffect(() => {
    const selected = restaurants.find(
      (r) => r.id.toString() === selectedRestaurant
    );
    if (selected) {
      setRateUpTo6km(selected.rateUpTo6km);
      setRateOutsideZone(selected.rateOutsideZone); // Assuming your restaurant objects have a rateUpTo6km property
    }
  }, [selectedRestaurant, restaurants]);

  const onMarkerDragEnd = async (lat, lng) => {
    try {
      // Use reverse geocoding to find the address from the coordinates
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const address = response.data.address;

      if (address) {
        // Update the city and street based on the reverse geocoding result
        setCity(address.city || address.town || address.village);
        setStreet(address.road || "");
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const token = decryptToken(encryptedToken); // Використання існуючого механізму дешифрування токену
      const response = await fetch(`${apiUrl}api/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Не вдалося завантажити ресторани");
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      // Обробка помилки
    }
  };

  const fetchRates = async () => {
    try {
      const endpoint = `${apiUrl}api/restaurants`;
      const token = decryptToken(encryptedToken);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the rates from the restaurants API");
      }

      const data = await response.json();
      // Assuming the API returns an array of objects and you need the first object's rates
      setRateUpTo6km(data[0].rateUpTo6km);
      setRateAbove6km(data[0].rateAbove6km); // This is the new line to set the rate above 6km
    } catch (error) {
      console.error("Error fetching rates:", error);
      // Handle error
    }
  };


  useEffect(() => {
    // Знайдіть об'єкт вибраного ресторану зі списку ресторанів
    const restaurant = restaurants.find(
      (r) => r.id.toString() === selectedRestaurant
    );

    if (restaurant && restaurant.lat && restaurant.lon) {
      // Оновіть markerCoordinates за допомогою координат вибраного ресторану
      setMarkerCoordinatesfirst({
        lat: parseFloat(restaurant.lat),
        lng: parseFloat(restaurant.lon),
      });
    }
  }, [selectedRestaurant, restaurants]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Call the function when the component mounts
  useEffect(() => {
    fetchRates(); // Note the function name has changed to reflect its broader purpose
  }, []);

  useEffect(() => {
    // При зміні міста очищаємо поля вулиці та номера будинку
    setStreet("");
    sethouse_number("");

    // Опціонально: очистити координати другого маркера, якщо потрібно
    setSecondMarkerPosition({
      lat: 50.04132, // Встановіть стандартні координати або координати за замовчуванням
      lng: 21.99901,
    });
  }, [city]);

  const handleSubmit = async () => {
    const postData = {
      phone_number: phone_number,
      street: street,
      apartment_number: apartment_number,
      city: city,
      description: description,
      amount: value.replace(" zł", "").replace(",", "."),
      delivery_time: deliveryTime,
      order_size: orderSize,
      payment_method: "Zapłacono Online",
      status: "Oczekujących",
      rateUpTo6km: rateUpTo6km,
      rateAbove6km: rateAbove6km,
      kilometry: kilometryWithComma,
      restaurant_id: selectedRestaurant,
      rateOutsideZone: rateOutsideZone,
      house_number: house_number,
    };

    try {
      const endpoint = `${apiUrl}api/orders`;
      const token = decryptToken(encryptedToken);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Handle the error according to your application's needs
        throw new Error(`Server error: ${errorText}`);
      }

      // Process successful response
      const data = await response.json();

      alert("Zlecenie zostało pomyślnie dodane.");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus(`Error submitting form: ${error.message}`);
    }
  };

  const handleKilometryChange = (e) => {
    setKilometry(e.target.value.replace(",", "."));
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h1>Dodać Zlecenie</h1>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setModalVisible(false)}
              className="icon-mark"
              style={{
                paddingLeft: "7px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            />
          </div>
          <div className="modal-body">
            <div className="modal-column">
              {/* Left column inputs */}
              <div className="input-group">
                <label>Numer telefonu</label>
                <PhoneInput
                  international
                  defaultCountry="PL"
                  value={phone_number}
                  onChange={setphone_number}
                  placeholder="Wpisz numer telefonu"
                  className="phone-input-hide-country-select"
                  countrySelectProps={{ style: { display: "none" } }}
                />
              </div>

              <div className="input-group">
                <label style={{ zIndex: "2" }}>Ulica</label>
                <StreetSelector
                  key={city}
                  city={city}
                  selectedStreet={street}
                  onSelectStreet={(selectedStreet) => {
                    setStreet(selectedStreet || "");
                    updateMapCoordinates(selectedStreet || "", house_number);
                  }}
                />
              </div>
              <div className="input-group">
                <label>Nr Mieszkania</label>
                <input
                  type="text"
                  value={apartment_number}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="Podaj numer mieszkania"
                />
              </div>

              <div className="input-group">
                <label>Czas dostawy</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                >
                  <option>Tak szybko, jak to możliwe</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Opis</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opisz, co zostanie dostarczone"
                />
              </div>

              <div className="input-group">
                <label>Nazwa Restauracji</label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                >
                  <option value="">Wybierz restaurację</option>{" "}
                  {/* Додано опцію за замовчуванням */}
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.restaurantName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Stawka do 6 km</label>
                <input
                  type="text"
                  value={`${Number(rateUpTo6km)
                    .toFixed(2)
                    .replace(".", ",")} zł`}
                  disabled
                  onChange={(e) => setRateUpTo6km(e.target.value)}
                  placeholder="Podaj stawkę do 6 km"
                />
              </div>
            </div>
            <div className="modal-column">
              {/* Right column inputs */}
              <div className="input-group">
                <label style={{ zIndex: "5" }}>Miejscowość</label>
                <CitySelector selectedCity={city} onSelectCity={setCity} />
              </div>

              <div className="input-group">
                <label style={{ zIndex: "1" }}>Nr Budynku</label>
                <NumerBudynku
                  key={`${city}-${street}`}
                  city={city}
                  street={street}
                  onSelecthouse_number={(selectedhouse_number) => {
                    sethouse_number(selectedhouse_number || "");
                    updateMapCoordinates(street, selectedhouse_number || "");
                  }}
                />
              </div>

              <div className="input-group">
                <label>Kwota</label>
                <input
                  type="text"
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Wielkość Zamówienia</label>
                <select
                  value={orderSize}
                  onChange={(e) => setOrderSize(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </select>
              </div>

              <div className="input-group">
                <label>Kilometry</label>
                <input
                  type="text"
                  value={`${Number(distance).toFixed(2).replace(".", ",")} km`}
                  onChange={handleKilometryChange}
                  placeholder="Wpisz ulice i wybierz restaurację, aby obliczyć kilometry"
                  disabled
                />
              </div>

              <div className="input-group">
                <label>Stawka poza strefą</label>
                <input
                  type="text"
                  disabled
                  value={`${(
                    Math.ceil(outsideDistance) * Number(rateOutsideZone)
                  )
                    .toFixed(2)
                    .replace(".", ",")} zł`}
                  placeholder="Podaj stawkę poza strefą"
                />
              </div>
            </div>
          </div>

          <div className="modal-body-1">
            <div className="input-group-3">
              <label>Droga Zamówienia na Mapie</label>
            </div>
            {selectedRestaurant && (
              <MapBoxComponentRoute
                setDistance={setDistance}
                setOutsideDistance={handleSetOutsideDistance}
                coordinates={markerCoordinatesfirst}
                rzeszowCoordinates={markerCoordinatesfirst}
                secondCoordinates={secondMarkerPosition}
                restaurantName={
                  restaurants.find((r) => r.id === selectedRestaurant)
                    ?.restaurantName
                }
                onMarkerDragEnd={onMarkerDragEnd}
                restaurantId={selectedRestaurant}
                street={street}
                city={city}
                house_number={house_number}
              />
            )}
          </div>

          <div className="modal-footer">
            <button className="custom-button" onClick={handleSubmit}>
              Dodać
            </button>
            <button
              className="cancel-button"
              onClick={() => setModalVisible(false)}
            >
              Anulować
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalComponent;
