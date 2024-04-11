import React, { useState } from 'react';
import { pl } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { NavLink } from "react-router-dom";


import TableCourier from './components/Kurierzy/TableCourier';
import ModalComponent from './components/Kurierzy/AddCouriers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faCalendar } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import "react-datepicker/dist/react-datepicker.css";

const Kuriers = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCourierListSelectVisible, setCourierListSelectVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Kurierzy</div>
        </div>
        <div className="right-groups">
   
        {isCourierListSelectVisible &&  <CourierListSelect />} {/* Відображення списку кур'єрів */}
       
          
     
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
            Dodaj Kuriera
          </div>
        </div>
        
      </div>
      <TableCourier />
      <ModalComponent isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
      
    </div>
    

    

    




  );
};

export default Kuriers;