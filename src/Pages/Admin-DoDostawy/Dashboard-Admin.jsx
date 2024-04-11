import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { UserProvider } from '../../contexts/UserContext'; // Імпортувати UserProvider
import Sidebar from './components/Sidebar';
import Order from './Order';
import Restaurant from './Restaurant';
import Historia from './Historia';
import HistoriaCouri from './HistoriaCouri';
import Delete from './Delete';
import Kuriers from './Kuriers';
import Analityka from './Analityka';
import Kalendar from './KalendarKuriers';
import Setting from './components/Setting/Security-Setting';
import Notifications from './components/Setting/Notifications-Setting';
import '../assets/Dashboard.css';
import Rozliczenie from './Rozliczenie';

function Dashboard() {
  return (
    <UserProvider>
    <div className="dashboard-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <Routes>
          <Route path="/zamowienia" element={<Order />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/orders/:restaurantId" element={<Historia />} />
          <Route path="/kuriers/orders/:courierId/:firstName/:lastName" element={<HistoriaCouri />} />
       
          <Route path="/analityka" element={<Analityka />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/kuriers" element={<Kuriers />} />
          <Route path="/kuriers/kalendar" element={<Kalendar />} />

          <Route path="/settings/security" element={<Setting />} />
          <Route path="/settings/notifications" element={<Notifications />} />
          <Route path="/generacja-rozliczen" element={<Rozliczenie />} />


        </Routes>
      </div>
    </div>
    </UserProvider>
  );
}


export default Dashboard;