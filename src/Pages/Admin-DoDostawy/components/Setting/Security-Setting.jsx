import React, { useState } from "react";
import { pl } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { NavLink } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PersonalData from './Ustawienia/PersonalDate.jsx';
import SidebarSetting from './SidebarSetting.jsx';


import ModalVersion from "../WersjaPlatformy/Version.jsx";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus as fasFaPlus,
  faBell,
  faCodeFork,
  faShieldHalved,
  faChartSimple,

} from "@fortawesome/free-solid-svg-icons";
import "../../../assets/Order.css";
import "../../../assets/Setting.css";
import "react-datepicker/dist/react-datepicker.css";

const Setting = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div className="order white-rounded-box">
        <div className="settings-container">
        <SidebarSetting />
      
      <PersonalData />

      
    </div>
    
    <ModalVersion isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      </div>
    </>
  );
};

export default Setting;

