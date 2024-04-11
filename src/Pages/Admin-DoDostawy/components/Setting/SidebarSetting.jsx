import React, { useState, useEffect } from "react";


import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus as fasFaPlus,
  faBell,
  faCodeFork,
  faShieldHalved,
  faChartSimple,
  faFilePen

} from "@fortawesome/free-solid-svg-icons";
import ModalVersion from "../WersjaPlatformy/Version.jsx";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const SidebarSetting = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('Loading...');

  const decryptToken = () => {
    const encryptedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_token"))
      ?.split("=")[1];
    if (!encryptedToken) {
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return null;
    }
  };

  const updateRates = async () => {
    // Припускаємо, що ваш токен зберігається в localStorage або будь-якому іншому сховищі
    const token = decryptToken();

    try {
      const response = await axios.post(`${apiUrl}api/update-rates`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data); // Виведіть відповідь сервера для подальшої обробки
      alert('Stawki zostały pomyślnie zaktualizowane');
    } catch (error) {
      console.error("Błąd podczas aktualizowania stawek: ", error.response ? error.response.data : error.message);
      alert('Błąd podczas aktualizowania stawek');
    }
  }

  return (
    <>
    <aside className="settings-sidebar">
        <h2>PODSTAWOWE USTAWIENIA</h2>
        <ul>
        <li><NavLink className={({ isActive }) => isActive ? 'actives' : ''} style={{color:"#6A6A6A"}} to="/dashboard-admin/settings/notifications"><FontAwesomeIcon icon={faBell} /> Ustawienia powiadomień</NavLink></li>
        </ul>
        <ul>
          <li onClick={() => setModalVisible(true)}><FontAwesomeIcon icon={faCodeFork} style={{paddingRight: '9px',}}/>Wersje Platformowe</li>
        </ul>
        <ul>
          <li onClick={updateRates}><FontAwesomeIcon icon={faFilePen} style={{paddingRight: '9px'}}/>Aktualizuj stawki</li>
        </ul>
        <h2>USTAWIENIA BEZPIECZEŃSTWA</h2>
        <ul>
          
        <li><NavLink className={({ isActive }) => isActive ? 'actives' : ''} style={{color:"#6A6A6A"}} to="/dashboard-admin/settings/security"><FontAwesomeIcon icon={faShieldHalved} /> Ustawienia bezpieczeństwa</NavLink></li>
        </ul>
      </aside>

      <ModalVersion isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
    </>
  );
};

export default SidebarSetting;