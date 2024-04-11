import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faPlus,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import CitySelector from "../Map/CitySelector.jsx";
import StreetSelector from "../Map/StreetSelector.jsx";

import axios from "axios";
import CryptoJS from "crypto-js";
import AdditionalRateLogic from "../DoDotkowe-Parametry-Restauracja/AdditionalRateLogic.jsx";
import MapBoxComponent from "../Map/MapBoxComponent.jsx";
import NumerBudynku from "../Map/NumerBudynkuClient.jsx";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const cleanRateValue = (value) => {
  return value.replace(" zł", "").replace(",", ".").replace("+", "");
};

function ModalEditRestaurants({
  isModalVisible,
  setModalVisible,
  restaurantDetails,
  setRestaurants,
}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [street, setStreet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isPyszneEnabled, setIsPyszneEnabled] = useState(false);
  const [partner, setPartner] = useState("");
  const [rateUpTo6km, setRateUpTo6km] = useState("");
  const [rateAbove6km, setRateAbove6km] = useState("");
  const [rateOutsideZone, setRateOutsideZone] = useState("");
  const [nipValue, setNipValue] = useState("");
  const [city, setCity] = useState("Rzeszów");
  const [short_name, setShortName] = useState("");
  const [konto, setKonto] = useState("");
  const [statuses, setStatuses] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [telegramNickname, setTelegramNickname] = useState("");


  const [house_number, sethouse_number] = useState("");
  const [ordersTo, setOrdersTo] = useState("");
  const [markerCoordinates, setMarkerCoordinates] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });



  useEffect(() => {
    // Цей ефект запускатиметься при зміні вулиці або міста
    updateMapCoordinates(street);
  }, [street, city]);

  const updateMapCoordinates = (streetName, houseNumber) => {
    if (!streetName || !city || !selectedRestaurant || !selectedRestaurant.id || !houseNumber) return;
  
    // Include the house number in the search query
    const query = encodeURIComponent(`${streetName} ${houseNumber}, ${city}`);
    axios
      .get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
      .then((response) => {
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMarkerCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });

          // Тепер оновлюємо координати на сервері
          const token = decryptToken();
          if (!token) {
            console.error("Authentication token is not available");
            return;
          }

          axios
            .put(
              `${apiUrl}api/restaurants-map-touch/${selectedRestaurant.id}/coordinates`,
              { lat, lon },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((updateResponse) => {
              // console.log("Coordinates updated on server successfully", updateResponse.data);
            })
            .catch((error) => {
              console.error("Error updating coordinates on server:", error);
            });
        }
      })
      .catch((error) => console.error("Error fetching location:", error));
      console.log(query)
  };

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

  // Завершення коду Додаткові параметри
  useEffect(() => {
    if (restaurantDetails) {
    
      const formatRateValue = (rate) => {
        return rate
          ? `+ ${parseFloat(rate).toFixed(2).replace(".", ",")} zł`
          : "+ 0,00 zł";
      };

      const formatRateValueTo = (rate) => {
        return rate
          ? `${parseFloat(rate).toFixed(2).replace(".", ",")} zł`
          : "+ 0,00 zł";
      };

      setSelectedRestaurant(restaurantDetails);
      setRestaurantName(restaurantDetails.restaurantName || "");
      setStreet(restaurantDetails.street || "");
      setPhoneNumber(restaurantDetails.phoneNumber || "");
      setEmail(restaurantDetails.email || "");
      setPartner(restaurantDetails.partner || "");
      setRateUpTo6km(formatRateValueTo(restaurantDetails.rateUpTo6km));
      setRateAbove6km(formatRateValue(restaurantDetails.rateAbove6km));
      setRateOutsideZone(formatRateValue(restaurantDetails.rateOutsideZone));
      setNipValue(restaurantDetails.nipValue || "");
      setCity(restaurantDetails.city || "Rzeszów");
      setShortName(restaurantDetails.short_name || "");
      setKonto(restaurantDetails.konto || "");
      setStatuses(restaurantDetails.statuses || "");
      setIsPyszneEnabled(restaurantDetails.pyszne || false);
      sethouse_number(restaurantDetails.house_number || "");
      setTelegramNickname(restaurantDetails.telegram_nickname || "");
    }
  }, [restaurantDetails]);

  // console.log(restaurantDetails)

  const decryptToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_token"))
      ?.split("=")[1];

    if (!cookieValue) {
      console.error("Token not found in cookies");
      return null;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(cookieValue, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Error decrypting token", e);
      return null;
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedRestaurant || selectedRestaurant.id === undefined) {
      console.error("Selected restaurant is undefined or does not have an id.");
      alert(
        "Nie można zaktualizować danych restauracji bez jej identyfikatora."
      );
      return;
    }

    const token = decryptToken();
    if (!token) {
      console.error("Authentication token is not available");
      return;
    }

    const restaurantData = {
      pyszne: isPyszneEnabled,
      restaurantName,
      street,
      phoneNumber,
      email,
      house_number,
      partner,
      rateUpTo6km: cleanRateValue(rateUpTo6km),
      rateAbove6km: cleanRateValue(rateAbove6km),
      rateOutsideZone: cleanRateValue(rateOutsideZone),
      telegram_nickname: telegramNickname,
      nipValue,
      city,
      short_name,
      konto,
      statuses,
    };

    if (password) {
      restaurantData.password = password;
    }

    // console.log("Restaurant data to be sent:", restaurantData);
    try {
      const response = await axios.put(
        `${apiUrl}api/restaurants/${selectedRestaurant.id}`,
        restaurantData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === selectedRestaurant.id
              ? { ...restaurant, ...restaurantData }
              : restaurant
          )
        );
        setModalVisible(false);
        alert("Dane restauracji zostały zaktualizowane.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating restaurant data:", error);
      alert("Nie udało się zaktualizować danych restauracji.");
    }
  };

  if (!isModalVisible) {
    return null;
  }

  const handleNipChange = (e) => {
    let input = e.target.value.replace(/[^0-9]/g, ""); // видаляємо всі символи, окрім цифр
    if (input.length <= 12) {
      // тут 8 цифр: XXXXXXXX
      input = "PL " + input.slice(0, 3) + " " + input.slice(3);
      setNipValue(input);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const inputVal = e.target.value;
    const rawNumber = inputVal.replace(/\D/g, ""); // видаляємо всі не-цифри

    // Якщо користувач хоче стерти "+48", дозволимо це зробити
    if (inputVal.length === 3) {
      // змінено з 2 на 3 для розпізнавання "+48 "
      setPhoneNumber("");
      return;
    }

    // Якщо номер складається більше ніж з 11 цифр, не змінюємо стан
    if (rawNumber.length > 11) return;

    let formattedNumber = "+48 "; // додано пробіл після "+48"
    const rawWithoutCountryCode = rawNumber.substring(2);

    for (let i = 0; i < rawWithoutCountryCode.length; i++) {
      if (i === 3 || i === 6) {
        formattedNumber += " ";
      }
      formattedNumber += rawWithoutCountryCode[i];
    }

    setPhoneNumber(formattedNumber);
  };

  const togglePasswordVisiblity = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const passwordLength = 12;
    let randomPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      randomPassword += chars.substring(randomNumber, randomNumber + 1);
    }
    setPassword(randomPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordChanged(true);
  };

  const handleBlur = (e, setter) => {
    let inputVal = e.target.value.replace(" zł", "").replace(",", ".");
    let floatValue = parseFloat(inputVal);

    if (!isNaN(floatValue)) {
      setter(floatValue.toFixed(2).replace(".", ",") + " zł");
    } else {
      setter("0,00 zł");
    }
  };

  const handleBlurOutsideZone = (e, setterFunc) => {
    let inputVal = e.target.value.replace(" zł", "").replace(",", ".");
    let floatValue = parseFloat(inputVal);

    if (!isNaN(floatValue)) {
      setterFunc("+ " + floatValue.toFixed(2).replace(".", ",") + " zł");
    } else {
      setterFunc("+ 0,00 zł");
    }
  };

  const handleInputClickOutsideZone = (e, setterFunc) => {
    setterFunc("");
  };

  const handleInputChangeOutsideZone = (e) => {
    const inputValue = e.target.value;
    if (/^[+,-,0-9,.zł\s]*$/.test(inputValue)) {
      setRateOutsideZone(inputValue);
    }
  };

  const handleBlurForAbove6km = (e, setterFunc) => {
    let inputVal = e.target.value.replace(" zł", "").replace(",", ".");
    let floatValue = parseFloat(inputVal);

    if (!isNaN(floatValue)) {
      setterFunc("+ " + floatValue.toFixed(2).replace(".", ",") + " zł");
    } else {
      setterFunc("+ 0,00 zł");
    }
  };

  const handleInputClick = (e, setterFunc) => {
    setterFunc("");
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^[+,-,0-9,.zł\s]*$/.test(inputValue)) {
      setRateAbove6km(inputValue);
    }
  };

  // Додаткові ставки
  const handleOrdersToChange = (e) => {
    setOrdersTo(e.target.value);
  };

  const handleRateUpTo6kmChange = (e) => {
    setRateUpTo6km(e.target.value);
  };

  const handleRateOutsideZoneChange = (e) => {
    setRateOutsideZone(e.target.value);
  };

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


  const handleRateAbove6kmChange = (e) => {
    setRateAbove6km(e.target.value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Edycja Restauracji</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible(false)}
            className="icon-mark"
            style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
          />
        </div>
        <div className="modal-body">
          <div className="modal-column">
            {/* Left column inputs */}
            <div className="input-group">
              <label>Nazwa Restauracji</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Wpisz nazwę restauracji"
              />
            </div>

            <div className="input-group">
              <label style={{ zIndex: "2" }}>Miejscowość</label>
              <CitySelector selectedCity={city} onSelectCity={setCity} />
            </div>

            <div className="input-group">
              <label style={{ zIndex: "1" }}>Nr Budynku</label>
              <NumerBudynku
                key={`${city}-${street}`}
                city={city}
                value={house_number}
                street={street}
                house_number={house_number}
                onSelecthouse_number={(selectedhouse_number) => {
                  sethouse_number(selectedhouse_number || "");
                  updateMapCoordinates(street, selectedhouse_number || "");
                }}
              />
            </div>

            <div className="input-group">
              <label>Poczta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
              />
            </div>

            <div className="input-group">
              <label>NIP</label>
              <input
                type="text"
                value={nipValue}
                onChange={handleNipChange}
                maxLength="16"
              />
            </div>

            <div className="input-group">
              <label>Stawka poza strefą</label>
              <input
                type="text"
                value={rateOutsideZone}
                onClick={(e) =>
                  handleInputClickOutsideZone(e, setRateOutsideZone)
                }
                onBlur={(e) => handleBlurOutsideZone(e, setRateOutsideZone)}
                onChange={handleInputChangeOutsideZone}
                pattern="[+,-,0-9,.zł\s]+"
              />
            </div>

            <div className="input-group">
              <label>Krótka Nazwa</label>
              <input
                type="text"
                value={short_name}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="Podaj skróconą nazwę restauracji"
              />
            </div>

            <div className="input-group">
              <label>Konto bankowe</label>
              <input
                type="text"
                value={konto}
                onChange={(e) => setKonto(e.target.value)}
                placeholder="Podaj konto bankowe"
              />
            </div>
          </div>
          <div className="modal-column">
            {/* Right column inputs */}
            <div className="input-group">
              <label>Numer telefonu</label>
              <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="+48 XXX XXX XXX"
              />
            </div>

            <div className="input-group">
              <label style={{zIndex: "2"}}>Ulica</label>
              <StreetSelector
                  city={city}
                  selectedStreet={street}
                  onSelectStreet={(selectedStreet) => {
                    setStreet(selectedStreet);
                    updateMapCoordinates(selectedStreet); // Оновлюємо координати на карті
                  }}
              />
            </div>

            <div className="input-group">
              <label>Partner</label>
              <input
                  type="text"
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  placeholder="Wprowadź imię i nazwisko partnera"
              />
            </div>

            <div className="input-group">
              <label>Stawka do 6 km</label>
              <input
                  type="text"
                  value={rateUpTo6km}
                  onBlur={(e) => handleBlur(e, setRateUpTo6km)}
                  onChange={(e) => setRateUpTo6km(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Stawka ponad 6 km</label>
              <input
                  type="text"
                  value={rateAbove6km}
                  onClick={(e) => handleInputClick(e, setRateAbove6km)}
                  onBlur={(e) => handleBlurForAbove6km(e, setRateAbove6km)}
                  onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Nowe Hasło</label>
              <div className="password-container">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Wygeneruj hasło"
                />
                <button
                    onClick={togglePasswordVisiblity}
                    className="toggle-password-visibility btn-password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                </button>
                <button
                    onClick={generatePassword}
                    className="generate-password btn-password"
                >
                  <FontAwesomeIcon icon={faKey}/>
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Telegram Nickname</label>
              <input
                  type="text"
                  value={telegramNickname}
                  onChange={(e) => setTelegramNickname(e.target.value)}
                  placeholder="Telegram nickname"
              />
            </div>

            <div className="input-group-2">
              <label>Włącz Pyszne.pl</label>
              <input
                  type="checkbox"
                  checked={isPyszneEnabled}
                  onChange={(e) => setIsPyszneEnabled(e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="modal-body-1">
          <div className="input-group-3">
            <label>Dodaj restaurację na mapie</label>
          </div>
          {selectedRestaurant && (
              <MapBoxComponent
              coordinates={markerCoordinates}
              rzeszowCoordinates={markerCoordinates}
              restaurantName={restaurantName}
              onMarkerDragEnd={onMarkerDragEnd}
              restaurantId={restaurantDetails.id} // перевіряємо, чи selectedRestaurant існу
              // Pass the function to MapBoxComponent
            />
          )}
        </div>

        <div className="modal-body-1">
          <div className="input-group-3">
            <label>Dodaj dodatkowe parametry</label>
            
          </div>

          {/* UI to add additional rate logic */}
          {selectedRestaurant && (
            <AdditionalRateLogic
              key={selectedRestaurant.id} // This forces a re-render when the selectedRestaurant changes
              restaurantId={selectedRestaurant.id}
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="custom-button" onClick={handleSaveChanges}>
            Zmień Dane
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
  );
}

export default ModalEditRestaurants;
