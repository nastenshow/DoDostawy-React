import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import TableOrder from './components/Zamowienia/TableOrder';
import ModalComponent from './components/Zamowienia/AddOrder';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import "react-datepicker/dist/react-datepicker.css";

const Order1 = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCourierListSelectVisible, setCourierListSelectVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Wszystkie Zamówienia</div>
        </div>
        <div className="right-groups">
       
          {/* <div className="group datepicker-group">
          <FontAwesomeIcon icon={faCalendarDays} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd.MM.yy"
              customInput={<input type="text" />}
              locale={pl} 
            />
            <span>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd.MM.yy"
              minDate={startDate}
              customInput={<input type="text" />}
              locale={pl} 
            />
          </div> */}
          
          <NavLink to="/dashboard-admin-restaurant/historia"><div className="group-botton">
            <FontAwesomeIcon icon={faClockRotateLeft} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Historia
          </div>
          </NavLink>
          <div className="group-botton-1" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={fasFaPlus} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Dodaj Zlecenie
          </div>
        </div>
        
      </div>
      <TableOrder />
      <ModalComponent isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
    </div>

    

    




  );
};

export default Order1;