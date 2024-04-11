import React, { useState, useEffect } from "react";
import ModalChangePersonalDate from "../Ustawienia/ModalChangePersonalDate.jsx";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const NotificationsSetting = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("Loading...");
  const [telegramNickname, setTelegramNickname] = useState(null);

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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/koordynacjashow`, {
        headers: {
          "Authorization": `Bearer ${decryptToken()}`
        }
      });
      if (response.data) {
        setTelegramNickname(response.data.telegram_nickname);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
      <>
        <main className="settings-content">
          <div className="personal-data-section">
            <h3>Wiadomość za pośrednictwem Telegramu</h3>
            <p>
              Tutaj będziesz mógł podłączyć bota Telegramu, aby otrzymywać
              powiadomienia.
            </p>
            <div className="action-section">
              <a
                  href="https://t.me/DodostawyBot"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <button className="btn-primary">
                  {telegramNickname ? "Przejdź do Bota" : "Połącz bota Telegramu"}
                </button>
              </a>
              <span className={telegramNickname ? "status-success" : "status-wywonczane"}>
              {telegramNickname ? "Włączony " : "Wyłączony "}
            </span>
            </div>
          </div>
        </main>

        <ModalChangePersonalDate
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
        />
      </>
  );
};

export default NotificationsSetting;
