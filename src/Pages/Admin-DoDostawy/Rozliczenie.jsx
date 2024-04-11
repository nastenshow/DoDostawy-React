import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import TableOrder from './components/RaportyRozliczeniowy/Rozliczenie-table';
import ModalComponentRozliczenie from './components/RaportyRozliczeniowy/Rozliczenie-Make';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '../assets/Order.css';
import "react-datepicker/dist/react-datepicker.css";

const Rozliczenie = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCourierListSelectVisible, setCourierListSelectVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          <div className="group-text">Wszystkie Rozliczenie</div>
        </div>
        <div className="right-groups">
       
         
          <div className="group-botton-1" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={fasFaPlus} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Generacja Rozliczeń
          </div>
        </div>
        
      </div>
      <TableOrder />
      <ModalComponentRozliczenie isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      
    </div>

    

    




  );
};

export default Rozliczenie ;