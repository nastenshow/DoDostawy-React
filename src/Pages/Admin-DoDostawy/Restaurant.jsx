import React, { useState } from 'react';
import { pl } from 'date-fns/locale';
import DatePicker from 'react-datepicker';


import RestauracjaList from './components/Restauracje/RestauracjaList';
import ModalComponent from './components/Restauracje/AddRestaurant';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import '../assets/Restauracja.css';
import "react-datepicker/dist/react-datepicker.css";

const Restaurant = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCourierListSelectVisible, setCourierListSelectVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Restauracje</div>
        </div>
        <div className="right-groups">
          
          <div className="group-botton" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={fasFaPlus} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Dodaj Restaurację
          </div>
        </div>
        
      </div>
      <RestauracjaList />
      <ModalComponent isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
    </div>

    

    




  );
};

export default Restaurant;