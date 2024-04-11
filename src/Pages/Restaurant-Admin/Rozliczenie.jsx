import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import TableOrder from './components/Rozliczenia/RozliczenieList';


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
          <div className="group-text">Raporty Rozliczeniowy</div>
        </div>
        <div className="right-groups">
       
         
          
        </div>
        
      </div>
      <TableOrder />
     
      
    </div>

    

    




  );
};

export default Rozliczenie ;