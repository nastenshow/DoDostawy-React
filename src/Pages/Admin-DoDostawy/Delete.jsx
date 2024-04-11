import React, { useState } from 'react';
import { pl } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import Footer from '../components-all/Footer';
import { NavLink, useNavigate } from 'react-router-dom';

import DeleteOrderTable from './components/Zamowienia/DeleteOrderTable';
import ModalComponent from './components/Zamowienia/AddOrder';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import "react-datepicker/dist/react-datepicker.css";

const Delete = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCourierListSelectVisible, setCourierListSelectVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Usunięte zamówienia</div>
        </div>
        <div className="right-groups">
        {/* <div className="group-botton" onClick={() => setCourierListSelectVisible(!isCourierListSelectVisible)}>
            <FontAwesomeIcon icon={faTruck} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Wybierz Kuriera
            <FontAwesomeIcon icon={faChevronDown} style={{paddingLeft: '7px', fontWeight: '800'}}/>
        </div> */}
        {isCourierListSelectVisible &&  <CourierListSelect />} {/* Відображення списку кур'єрів */}
       
          
        <NavLink to="/dashboard-admin/restaurant"><div className="group-botton">
            <FontAwesomeIcon icon={faClockRotateLeft} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Historia
          </div>
          </NavLink>
          <NavLink to="/dashboard-admin/zamowienia"><div className="group-botton-1">
            <FontAwesomeIcon icon={faArrowDownShortWide} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Zamówienia
          </div>
          </NavLink>
        </div>
        
      </div>
      <DeleteOrderTable />
      <ModalComponent isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
      
    </div>
    

    

    




  );
};

export default Delete;