import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;


function ModalEditCouriers({
  isModalVisible,
  setModalVisible,
  courierDetails,
  setCouriers,
}) {
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [displayHourlyRate, setDisplayHourlyRate] = useState("");
  const [displayAdditionalCompensation, setDisplayAdditionalCompensation] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contractType, setContractType] = useState("");

  const [pesel, setPesel] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [additionalCompensation, setAdditionalCompensation] = useState("");

  useEffect(() => {
    if (courierDetails) {
      setSelectedCourier(courierDetails);
      setFirstName(courierDetails.first_name || "");
      setLastName(courierDetails.last_name || "");
      setPhoneNumber(courierDetails.phone_number || "");
      setEmail(courierDetails.email || "");
      setContractType(courierDetails.contract_type || "");
    
      setPesel(courierDetails.pesel || "");
      setBankAccount(courierDetails.bank_account || "");
      setHourlyRate(courierDetails.hourly_rate || "");
      setAdditionalCompensation(courierDetails.additional_compensation || "");
    

    const formattedHourlyRate = courierDetails.hourly_rate 
      ? `${parseFloat(courierDetails.hourly_rate).toFixed(2).replace(".", ",")} zł` 
      : "";
    setDisplayHourlyRate(formattedHourlyRate);
    setHourlyRate(courierDetails.hourly_rate || "");

    const formattedAdditionalCompensation = courierDetails.additional_compensation
      ? `+ ${parseFloat(courierDetails.additional_compensation).toFixed(2).replace(".", ",")} zł`
      : "";
    setDisplayAdditionalCompensation(formattedAdditionalCompensation);
    setAdditionalCompensation(courierDetails.additional_compensation || "");
  }
  }, [courierDetails]);

  const handleHourlyRateChange = (e) => {
    setDisplayHourlyRate(e.target.value);
  };

  const handleHourlyRateBlur = () => {
    const numericValue = parseFloat(displayHourlyRate.replace(",", "."));
    if (!isNaN(numericValue)) {
      setDisplayHourlyRate(`${numericValue.toFixed(2).replace(".", ",")} zł`);
      setHourlyRate(numericValue.toString());
    }
  };

  const handleHourlyRateFocus = (e) => {
    const valueWithoutCurrency = e.target.value.replace(/ zł/g, "").replace(",", ".");
    setDisplayHourlyRate(valueWithoutCurrency);
  };

  // Функції для обробки зміни додаткового винагородження
  const handleAdditionalCompensationChange = (e) => {
    setDisplayAdditionalCompensation(e.target.value);
  };

  const handleAdditionalCompensationBlur = () => {
    const numericValue = parseFloat(displayAdditionalCompensation.replace(",", "."));
    if (!isNaN(numericValue)) {
      setDisplayAdditionalCompensation(`+ ${numericValue.toFixed(2).replace(".", ",")} zł`);
      setAdditionalCompensation(numericValue.toString());
    }
  };

  const handleAdditionalCompensationFocus = (e) => {
    const valueWithoutCurrency = e.target.value.replace(/\+ /g, "").replace(/ zł/g, "").replace(",", ".");
    setDisplayAdditionalCompensation(valueWithoutCurrency);
  };

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
    if (!selectedCourier || selectedCourier.id === undefined) {
      console.error("Selected courier is undefined or does not have an id.");
      alert("Nie można zaktualizować danych kuriera bez jego identyfikatora.");
      return;
    }
  
    // Додаткова перевірка, щоб переконатися, що всі поля заповнені
    if (!firstName || !lastName || !email || !hourlyRate) {
      alert("Wszystkie wymagane pola muszą być wypełnione.");
      return;
    }
  
    const token = decryptToken();
    if (!token) {
      console.error("Authentication token is not available");
      return;
    }
  
    const courierData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      contract_type: contractType,
      pesel: pesel,
      bank_account: bankAccount,
      hourly_rate: hourlyRate,
      additional_compensation: additionalCompensation,
    };
  
    try {
      const response = await axios.put(
        `${apiUrl}api/editcouriers/${selectedCourier.id}`,
        courierData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setCouriers((prevCouriers) =>
          prevCouriers.map((courier) =>
            courier.id === selectedCourier.id
              ? { ...courier, ...response.data }
              : courier
          )
        );
        setModalVisible(false);
        alert("Dane kuriera zostały zaktualizowane.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating courier data:", error);
      alert("Nie udało się zaktualizować danych kuriera.");
    }
  };

  // ... other handlers ...

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Edycja Kuriera</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible(false)}
            className="icon-mark"
            style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
          />
        </div>

        <div className="modal-body">
          <div className="modal-column">
            {/* Input fields for courier data */}
            <div className="input-group">
              <label>Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Wpisz imię kuriera"
                disabled
              />
            </div>

            <div className="input-group">
              <label>Numer Telefonu</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Podaj numer telefonu"
                
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
              <label>Pesel</label>
              <input
                type="text"
                value={pesel}
                onChange={(e) => setPesel(e.target.value)}
                placeholder="Podaj pesel"
              />
            </div>

            

            <div className="input-group">
            <label>Dodatkowe wynagrodzenie za zamówienie</label>
            <input
              type="text"
              value={displayAdditionalCompensation}
              onChange={handleAdditionalCompensationChange}
              onBlur={handleAdditionalCompensationBlur}
              onFocus={handleAdditionalCompensationFocus}
              placeholder="Podaj dodatkowe wynagrodzenie"
            />
          </div>
          </div>

          <div className="modal-column">
            <div className="input-group">
              <label>Nazwisko</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Podaj nazwisko kuriera"
                disabled
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
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
          <button className="custom-button" onClick={handleSaveChanges}>
            Zapisz zmiany
          </button>
          <button
            className="cancel-button"
            onClick={() => setModalVisible(false)}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEditCouriers;
