import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import axios from "axios";
import Navbar from './components/Navbar';
// import Navbar from './components/Historia';

import Order from './Order';
import Pyszne from './Pyszne';
import Historia from './Historia';
import '../assets/Dashboard.css';
import Analityka from './Analityka';
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Rozliczenie from "./Rozliczenie";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

function Dashboard1() {
  const navigate = useNavigate();
  const [showPyszneApiLink, setShowPyszneApiLink] = useState(true);
  useEffect(() => {
    const fetchRestaurantData = async () => {

   
      const token = Cookies.get('user_token');
      const decryptedToken = CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/restaurants', {
          headers: {
            Authorization: `Bearer ${decryptedToken}`, // Замініть token на вашу змінну токену
          },
        });
  
        if (response.data && response.data.length > 0) {
          // Припускаємо, що ви хочете перевірити `pyszne` для першого ресторану в списку
          setShowPyszneApiLink(response.data[0].pyszne);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };
  
    fetchRestaurantData();
  }, []);


  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <Routes>
          <Route path="/zamowienia" element={<Order />} />

          <Route path="/historia" element={<Historia />} />
          <Route path="/pyszne-api" element={showPyszneApiLink ? <Pyszne /> : <Navigate to="/dashboard-admin-restaurant/analityka" />} />
          <Route path="/analityka" element={<Analityka />} />
          <Route path="/rozliczenie" element={<Rozliczenie />} />
          {/* <Route path="/restaurant" element={<Restaurant />} /> */}

        </Routes>
      </div>
    </div>
  );
}


export default Dashboard1;