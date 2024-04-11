import React, { useState } from 'react';
import '../../assets/Navbar.css';
import Clock from '../../components-all/Clock';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {faTelegram} from "@fortawesome/free-brands-svg-icons";


const Navbar = () => {
  const [time, setTime] = useState(new Date());

  const handleTimeUpdate = (newTime) => {
    setTime(newTime);
  };

    const handleClick = () => {
        // Redirecting to external URL
        window.open('https://t.me/DodostawyBot', '_blank', 'noopener,noreferrer');
    };


    return (
    <nav>
      <div className="logo">
        <Link to="/dashboard-admin">DoDostawy Beta</Link> 
      </div>
      
      <div className="contact">
        <div className='container'>
            <p style={{width:"130%"}}>Aktualny czas: {new Intl.DateTimeFormat('default', {
            timeZone: 'Europe/Warsaw',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(time)}</p>
        </div>
          <FontAwesomeIcon icon={faTelegram} onClick={handleClick} style={{paddingLeft: '10%', paddingRight: '3%', fontSize: '25px'}}/>
      </div>
      <Clock onTimeUpdate={handleTimeUpdate} />
    </nav>
  );
};

export default Navbar;