import React, { useState, useEffect } from "react";
import ModalChangePersonalDate from "./ModalChangePersonalDate.jsx";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const PersonalData = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('Loading...');

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
      const token = decryptToken();
      if (!token) {
        console.error("Authentication token is not available");
        return;
      }
      const response = await axios.get(`${apiUrl}api/koordynacjashow`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.data && response.data.updated_at) {
        setLastUpdate(new Date(response.data.updated_at).toLocaleDateString());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isModalVisible]);

  return (
    <>
    <main className="settings-content">
      <div className="personal-data-section">
        <h3>Moje dane osobowe</h3>
        <p>To Twoje dane osobowe, które możesz zmienić.</p>
        <div className="action-section">
          <button className="btn-primary" onClick={() => setModalVisible(true)}>Zmień Dane</button>
          <span className="last-change">Ostatnia zmiana: {lastUpdate}</span>
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

export default PersonalData;