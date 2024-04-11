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


function ModalChangePersonalDate({ isModalVisible, setModalVisible }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [telegramNickname, setTelegramNickname] = useState(""); // New state for telegram_nickname

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

  useEffect(() => {
    if (isModalVisible) {
      fetchUserData();
    }
  }, [isModalVisible]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/koordynacjashow`, {
        headers: {
          "Authorization": `Bearer ${decryptToken()}`
        }
      });
      if (response.data) {
        setUserEmail(response.data.email);
        setTelegramNickname(response.data.telegram_nickname);
        // Set other user data as needed
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSaveChanges = async () => {
    const token = decryptToken();
    if (!token) {
      console.error("Authentication token is not available");
      return;
    }

    let userData = {
      email: userEmail.trim() !== "" ? userEmail : null,
      telegram_nickname: telegramNickname.trim() !== "" ? telegramNickname : null,
    };

    // Включаємо пароль у запит лише якщо він був введений
    if (userPassword.trim() !== "") {
      userData.password = userPassword;
    }

    try {
      const response = await axios.put(
        `${apiUrl}api/koordynacja`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Dane konta zostały pomyślnie zaktualizowane.");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Dane konta napotkały błąd podczas zmiany danych.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Edytuj dane koordynacyjne</h1>
          <FontAwesomeIcon icon={faXmark} onClick={() => setModalVisible(false)} className="icon-mark"/>
        </div>
        <div className="modal-body">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                   placeholder="example@example.com"/>
          </div>

          <div className="input-group">
            <label>Hasło</label>
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} value={userPassword}
                     onChange={(e) => setUserPassword(e.target.value)} placeholder="Podaj nowe hasło"/>
              <button onClick={togglePasswordVisibility} className="toggle-password-visibility btn-password">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
              </button>
            </div>
          </div>
        </div>
        <div className="input-group"> {/* New input for telegram_nickname */}
          <label>Telegram Nickname</label>
          <input type="text" value={telegramNickname} onChange={(e) => setTelegramNickname(e.target.value)}
                 placeholder="Twoj Nickname w Telegramie"/>
        </div>

        <div className="modal-footer">
          <button className="custom-button" onClick={handleSaveChanges}>Zapisz zmiany</button>
          <button className="cancel-button" onClick={() => setModalVisible(false)}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

export default ModalChangePersonalDate;