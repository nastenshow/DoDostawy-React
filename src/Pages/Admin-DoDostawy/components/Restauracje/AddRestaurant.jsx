import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import MapComponent from "../Map/MapComponent.jsx";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import CitySelector from '../Map/CitySelector.jsx';
import StreetSelector from '../Map/StreetSelector.jsx';

const apiUrl = import.meta.env.VITE_LINK;

const cleanRateValue = (value) => {
  return value.replace(" zł", "").replace(",", ".").replace("+", "");
};

function ModalComponent({ isModalVisible, setModalVisible }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [street, setStreet] = useState("");
  const [phoneNumber, setphone_number] = useState("");
  const [email, setEmail] = useState(""); // Add state for email
  const [partner, setPartner] = useState("");
  const [rateUpTo6km, setRateUpTo6km] = useState("0,00 zł");
  const [isPyszneEnabled, setIsPyszneEnabled] = useState(false);
  const [rateAbove6km, setRateAbove6km] = useState("+ 0,00 zł");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rateOutsideZone, setRateOutsideZone] = useState("+ 0,00 zł");
  const [nipValue, setNipValue] = useState("PL ");
  const [city, setCity] = useState("Rzeszów");
  const [short_name, setShortName] = useState("");
  const [konto, setKonto] = useState("");


  const handleRegistration = async () => {
    // Gather all data into a single object
    const registrationData = {
      restaurantName,
      street,
      phoneNumber,
      rateUpTo6km: cleanRateValue(rateUpTo6km),
      rateAbove6km: cleanRateValue(rateAbove6km),
      rateOutsideZone: cleanRateValue(rateOutsideZone),
      password,
      short_name,
      nipValue,
      city,
      email,
      partner,
      konto,
      statuses: "Działa",
      lat: "0",
      lon: "0",
      
      pyszne: isPyszneEnabled,
      // ... add any other fields that are required for registration
    };

  

    // Send the POST request to your API
    try {
      const response = await fetch(`${apiUrl}api/restaurants`, {
        // Use the correct URL for your registration endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const responseData = await response.json();
    
        // Handle success (e.g., show message, redirect, etc.)
        alert("Registration successful");
        window.location.reload();
        // Reset form if needed or close modal
        setModalVisible(false);
      } else {
        // If we reach here, there was some error with the request
        const errorData = await response.json();
        console.error("Server error response data:", errorData);
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error("There was an error registering:", error);
      alert("Registration failed: Network error or server is down");
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

  const togglePasswordVisiblity = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleNipChange = (e) => {
    let input = e.target.value.replace(/[^0-9]/g, ""); // видаляємо всі символи, окрім цифр
    if (input.length <= 12) {
      // тут 8 цифр: XXXXXXXX
      input = "PL " + input.slice(0, 3) + " " + input.slice(3);
      setNipValue(input);
    }
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

  const handleChange = (e) => {
    let value = e.target.value;
    if (value && !value.startsWith("+")) {
      value = "+" + value;
    }
    setRateAbove6km(value);
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Dane Restauracji</h1>
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
              <label style={{zIndex: "2"}}>Miejscowość</label>
              <CitySelector
            selectedCity={city}
            onSelectCity={setCity}
            
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
              <PhoneInput
                international
               
                value={phoneNumber}
                onChange={setphone_number}
                placeholder="Wpisz numer telefonu"
                className="phone-input-hide-country-select"
                countrySelectProps={{ style: { display: "none" } }}
              />
            </div>


            <div className="input-group">
              <label style={{zIndex: "2"}}>Ulica</label>
              <StreetSelector
          city={city}
          selectedStreet={street}
          onSelectStreet={(selectedStreet) => {
            setStreet(selectedStreet);

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
              <label>Hasło</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wygeneruj hasło"
                />
                <button
                  onClick={togglePasswordVisiblity}
                  className="toggle-password-visibility btn-password"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
                <button
                  onClick={generatePassword}
                  className="generate-password btn-password"
                >
                  <FontAwesomeIcon icon={faKey} />
                </button>
              </div>
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

        {/* <div className="modal-header">
                    <h1>Mapa</h1>
                    <MapComponent />
                </div> */}

        <div className="modal-footer">
          <button className="custom-button" onClick={handleRegistration}>
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
  );
}

export default ModalComponent;
