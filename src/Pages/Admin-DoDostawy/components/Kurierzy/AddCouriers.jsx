import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";


registerLocale("pl", pl);
setDefaultLocale("pl");

const apiUrl = import.meta.env.VITE_LINK;

function ModalComponent({ isModalVisible, setModalVisible }) {
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contractType, setContractType] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [displayAdditionalCompensation, setDisplayAdditionalCompensation] =
    useState("");
  const [pesel, setPesel] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [displayHourlyRate, setDisplayHourlyRate] = useState("");
  const [additionalCompensation, setAdditionalCompensation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  
  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // Отримуємо ключ для дешифрування з змінних середовища
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  // Функція для дешифрування токену
  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleHourlyRateChange = (e) => {
    // Directly use the input value for the state
    setDisplayHourlyRate(e.target.value);
  };

  const handleHourlyRateBlur = () => {
    // On blur, format the value with "zł" if it's not empty and if it's a number
    const numericValue = parseFloat(displayHourlyRate.replace(",", "."));
    if (!isNaN(numericValue)) {
      setDisplayHourlyRate(`${numericValue.toFixed(2).replace(".", ",")} zł`);
      setHourlyRate(numericValue.toString()); // Store the numeric value for the server
    }
  };

  const handleHourlyRateFocus = (e) => {
    // On focus, remove "zł" for editing
    const valueWithoutCurrency = e.target.value
      .replace(/ zł/g, "")
      .replace(",", ".");
    setDisplayHourlyRate(valueWithoutCurrency);
  };

  const handleAdditionalCompensationChange = (e) => {
    setDisplayAdditionalCompensation(e.target.value);
  };

  const handleAdditionalCompensationBlur = () => {
    const numericValue = parseFloat(
      displayAdditionalCompensation.replace(",", ".")
    );
    if (!isNaN(numericValue)) {
      setDisplayAdditionalCompensation(
        `+ ${numericValue.toFixed(2).replace(".", ",")} zł`
      );
      setAdditionalCompensation(numericValue.toString());
    }
  };

  const handleAdditionalCompensationFocus = (e) => {
    const valueWithoutCurrency = e.target.value
      .replace(/\+ /g, "")
      .replace(/ zł/g, "")
      .replace(",", ".");
    setDisplayAdditionalCompensation(valueWithoutCurrency);
  };



  const handleSubmit = async () => {
    const hourlyRateNumber = hourlyRate ? parseFloat(hourlyRate) : null;
  const additionalCompensationNumber = additionalCompensation 
      ? parseFloat(additionalCompensation) 
      : null;

  // Конвертація назад у рядки для відправки на сервер
  const hourlyRateString = hourlyRateNumber !== null ? hourlyRateNumber.toString() : null;
  const additionalCompensationString = additionalCompensationNumber !== null 
      ? additionalCompensationNumber.toString() 
      : null;
      
    const postData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      contract_type: contractType,
      date_of_birth: dateOfBirth,
      pesel: pesel,
      bank_account: bankAccount,
      hourly_rate: hourlyRateString,
    additional_compensation: additionalCompensationString,
    };

    try {
      const endpoint = `${apiUrl}api/couriers`;
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

  if (!isModalVisible) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h1>Dodać Kuriera</h1>
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
              {/* Ліва колонка інпутів */}
              <div className="input-group">
                <label>Imię</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Podaj imię"
                />
              </div>

              <div className="input-group">
                <label>Numer Telefonu</label>
                <PhoneInput
                  international
                  defaultCountry="PL"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Wpisz numer telefonu"
                  className="phone-input-hide-country-select"
                  countrySelectProps={{ style: { display: "none" } }}
                />
              </div>

              <div className="input-group">
                <label>Rodzaj Umowy</label>
                <select
                  value={contractType}
                  required
                  onChange={(e) => setContractType(e.target.value)}
                  placeholder="Wybierz rodzaj umowy"
                >
                  <option value="">--Wybierz--</option>
                  <option value="Umowa o pracę">Umowa o pracę</option>
                  <option value="Umowa zlecenie">Umowa zlecenie</option>
                  <option value="Inne formy zatrudnienia">
                    Inne formy zatrudnienia
                  </option>
                </select>
              </div>

              <div className="input-group">
                <label>PESEL</label>
                <input
                  type="text"
                  value={pesel}
                  onChange={(e) => setPesel(e.target.value)}
                  placeholder="Podaj PESEL"
                />
              </div>

              
              <div className="input-group">
                <label>Dodatkowe wynagrodzenie za zamówienie</label>
                <input
                  type="text"
                  required
                  value={displayAdditionalCompensation}
                  onChange={handleAdditionalCompensationChange}
                  onBlur={handleAdditionalCompensationBlur}
                  onFocus={handleAdditionalCompensationFocus}
                  placeholder="Podaj dodatkowe wynagrodzenie"
                />
              </div>
            </div>

            <div className="modal-column">
              {/* Права колонка інпутів */}
              <div className="input-group">
                <label>Nazwisko</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Podaj nazwisko"
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Podaj email"
                />
              </div>

             

              <div className="input-group">
                <label>Konto Bankowe</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Podaj numer konta bankowego"
                />
              </div>
              <div className="input-group">
                <label>Wynagrodzenie za godzinę pracy</label>
                <input
                  type="text"
                  required
                  value={displayHourlyRate}
                  onChange={handleHourlyRateChange}
                  onBlur={handleHourlyRateBlur}
                  onFocus={handleHourlyRateFocus}
                  placeholder="Podaj stawkę za godzinę"
                />
              </div>

             
            </div>
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
