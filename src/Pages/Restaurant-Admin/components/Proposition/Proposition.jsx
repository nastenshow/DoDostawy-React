import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

function ModalComponent({ isModalVisible, setModalVisible }) {
  const [status, setStatus] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [reasons, setReasons] = useState("");
  const [description, setDescription] = useState("");

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // Функція для дешифрування токену
  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleSubmit = async () => {
    const postData = {
      restaurant_name: restaurantName,
      reasons: reasons,
      description: description,
    };

    try {
      const endpoint = `${apiUrl}api/send-email`; // Оновлений шлях до API
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
        // Обробка помилки відповідно до потреб вашого додатку
        throw new Error(`Server error: ${errorText}`);
      }

      // Обробка успішної відповіді
      const data = await response.json();
      console.log("Success:", data);

      alert("List został pomyślnie wysłany.");
      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus(`Error submitting form: ${error.message}`);
    }
    console.log("postData:", postData);
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Wyślij Propozycję</h1>
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
              <label>Nazwa restauracji</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Wpisz nazwę restauracji"
              />
            </div>

            <div className="input-group">
            <label>Opis</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wprowadź opis"
            />
          </div>

          </div>
          <div className="modal-column">
            {/* Right column inputs */}

            <div className="input-group">
              <label>Powody</label>
              <select
                value={reasons}
                onChange={(e) => setReasons(e.target.value)}
              >
                <option value="">Wybierz powód</option>
                <option value="Błąd systemu">Błąd systemu</option>
                <option value="Propozycja dotycząca funkcjonalności">
                  Propozycja dotycząca funkcjonalności
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="custom-button" onClick={handleSubmit}>
          Wysłać
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
