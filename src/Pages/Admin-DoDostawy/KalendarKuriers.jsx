import React, { useState, useEffect } from 'react';
import { pl } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { NavLink } from "react-router-dom";


import KalendarCouriers from './components/Kurierzy/KalendarCouriers';
import ModalComponentCalendar from './components/Kurierzy/AddCalendarCouriers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faCalendar } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import "react-datepicker/dist/react-datepicker.css";

const Kuriers = () => {
  const [startDate, setStartDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const [schedules, setSchedules] = useState(new Date()); // Додати стан для графіків
  const [dateSelected, setDateSelected] = useState(false);

  // Функція для декриптування токена
  const decryptToken = () => {
    // ваш код для декриптування токена
  };


  // Функція для обробки зміни дати
  const handleStartDateChange = async (date) => {
    setStartDate(date);
    setDateSelected(true);
    const formattedDate = date.toISOString().split('T')[0]; // Переконайтеся, що цей формат дати приймається сервером
    const token = decryptToken();
  
    try {
      // Замініть `your-api-url` на фактичний URL вашого API
      const response = await fetch(`your-api-url/api/courier-schedule?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Network response was not ok");
  
      const scheduleData = await response.json();
      setSchedules(scheduleData); // Оновлюємо стан з даними графіків
      
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {
    const fetchInitialData = async () => {
      await handleStartDateChange(new Date()); // Відправляємо сьогоднішню дату при першому завантаженні
    };
  
    fetchInitialData();
  }, []);
  
  



  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Kalendarz Kalendarz 
          </div>
        </div>
        <div className="right-groups">
   
       {/* Відображення списку кур'єрів */}
        <div className="input-group datepicker-group">
        <FontAwesomeIcon icon={faCalendarDays} size="lg" style={{ paddingRight: "7px", fontWeight: "800" }} />
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
          customInput={<input type="text" />}
          locale={pl}
        />
      </div>
          
        <NavLink to={`/dashboard-admin/kuriers`}>
            <div className="group-botton">
              <FontAwesomeIcon
                icon={faTruck}
                size="lg"
                style={{ paddingRight: "7px", fontWeight: "800" }}
              />
              Kurierzy
            </div>
          </NavLink>

          <NavLink to={`/dashboard-admin/kuriers/kalendar`}>
          <div className="group-botton">
            <FontAwesomeIcon icon={faCalendar} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Kalendarz
          </div>
          </NavLink>

          <div className="group-botton-1" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={fasFaPlus} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Dodaj Godziny Pracy
          </div>
        </div>
        
      </div>
      {dateSelected && <KalendarCouriers schedules={schedules} selectedDate={startDate} />} {/* Передача графіків у компонент */}
      <ModalComponentCalendar isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
      
    </div>
    

    

    




  );
};

export default Kuriers;