import React, { useState, useEffect } from "react";
import '../../assets/Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownShortWide, faLocationDot, faBars, faTruck, faCog, faRightFromBracket, faTrash, faArrowLeft, faArrowRight, faChartSimple, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import CryptoJS from 'crypto-js';




const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const Sidebar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [contentStyle, setContentStyle] = useState({ marginLeft: '200px' });

  const [isActive, setIsActive] = React.useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(
  );
  const [isButtonVisible, setIsButtonVisible] = useState(
    window.innerWidth < 2050
  );

  const handleLogout = async () => {
    // Retrieve the encrypted token from the cookies
    const encryptedToken = document.cookie.replace(/(?:(?:^|.*;\s*)user_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    // Decrypt the token
    let token;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      token = bytes.toString(CryptoJS.enc.Utf8);
      if (!token) throw new Error('Failed to decrypt token.');
    } catch (error) {
      console.error('Error decrypting token:', error);
      // Handle decryption error (show a message to the user, etc.)
      return;
    }

    try {
      // Call the logout API with the decrypted token
      await axios.post(`${apiUrl}api/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear the user_token cookie
      document.cookie = 'user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (show a message to the user, etc.)
    }
  };

  
  const toggleSidebar = () => {
    const newVisibility = !isSidebarVisible;
    setIsSidebarVisible(newVisibility);
  
    // Update the content margin
    setContentStyle({
      marginLeft: newVisibility ? '0px' : '200px' // Adjust these values as needed
    });
  
    // Save the state to cookies
    document.cookie = `sidebarVisible=${newVisibility}; path=/;`;
  };

  useEffect(() => {
    // Check if the sidebar state is saved in cookies
    const savedSidebarState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebarVisible='))
      ?.split('=')[1];
  
    if (savedSidebarState !== undefined) {
      setIsSidebarVisible(savedSidebarState === 'true');
    } else {
      // If there is no saved state in cookies, use window width
      setIsSidebarVisible(window.innerWidth >= 2001);
    }
  }, []);
  
  useEffect(() => {
    const content = document.querySelector('.content');
    if (content) {
      if (isSidebarVisible) {
        content.classList.add('with-sidebar');
      } else {
        content.classList.remove('with-sidebar');
      }
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    const handleResize = () => {
      setIsButtonVisible(window.innerWidth < 5050);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
    return (
      <>
      {isButtonVisible && (
        <button
          className={`botton-hide ${isSidebarVisible ? "" : "move-to-edge"}`}
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon
            icon={isSidebarVisible ? faBars : faArrowRight}
            style={{
              paddingRight: isSidebarVisible ? "10px" : "0px",
              zIndex: isSidebarVisible ? "1" : "1",
              fontSize: "20px",
              color: isSidebarVisible ? "#6a6a6a" : "#212529",
            }}
          />
        </button>
      )}
        <div className={`sidebar ${isSidebarVisible ? "" : "hide"}`}>
          <h2>Menu</h2>
          <ul>

            <li>
            <NavLink to="/dashboard-admin/analityka" activeclassname="active">
                <FontAwesomeIcon icon={faChartSimple} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Analityka
                </div>
            </NavLink>
            </li>
            <li>
            
            <NavLink to="/dashboard-admin/zamowienia" activeclassname="active">
                <FontAwesomeIcon icon={faArrowDownShortWide} style={{paddingRight: '9px',}}/>
                <div className='text'>
                    Zamówienia
                </div>
            </NavLink>
            </li>
            <li>
            <NavLink to="/dashboard-admin/generacja-rozliczen" activeclassname="active" >
                <FontAwesomeIcon icon={faFileInvoice} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Raporty Rozliczeniowy
                </div>
            </NavLink>
            </li>
            <li>
            <NavLink to="/dashboard-admin/restaurant" activeclassname="active" >
                <FontAwesomeIcon icon={faLocationDot} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Restauracje
                </div>
            </NavLink>
            </li>
            <li>
            <NavLink to="/dashboard-admin/kuriers" activeclassname="active" >
                <FontAwesomeIcon icon={faTruck} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Kurierzy
                </div>
            </NavLink>
            </li>
            <li>
            <NavLink to="/dashboard-admin/delete" activeclassname="active" >
                <FontAwesomeIcon icon={faTrash} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Usunięto
                </div>
            </NavLink>
            </li>

            <li>
            <NavLink to="/dashboard-admin/settings/security" activeclassname="active" >
                <FontAwesomeIcon icon={faCog} style={{paddingRight: '9px',}}/>
                <div className='text'>
                Ustawienia
                </div>
            </NavLink>
            </li>
            <li>
                <button onClick={handleLogout} className={`logout-button ${isActive ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faRightFromBracket} style={{ paddingRight: '9px' }} />
                    <div className='text'>
                        Wyloguj
                    </div>
                </button>
            </li>
            
          </ul>
         
        </div>
        </>
      );
      
    };

export default Sidebar;