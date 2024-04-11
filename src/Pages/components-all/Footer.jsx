import React, { useState } from 'react';
import ModalComponent from './Polityki/Kontakt';
import  ModalPolityka from './Polityki/PolitykaKonf';
import  ModalZasady from './Polityki/Zasady';
import  ModalZwroty from './Polityki/Zwroty';
import  ModalCookie from './Polityki/Cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as fasFaPlus, faClockRotateLeft, faCalendarDays, faTruck, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [isModalVisible4, setModalVisible4] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <footer className="footer-container">
      <p>© 2023 DoDostawy. All Rights Reserved.</p>
      <div className="footer-links">
        <div className="footer-column">
          <a href="#" onClick={() => setModalVisible4(true)}>Polityka Cookie</a>
          <a href="#"onClick={() => setModalVisible3(true)}>Polityka Zwrotów</a>
          <a href="#"onClick={() => setModalVisible2(true)}>Zasady i Warunki</a>
          <a href="#" onClick={() => setModalVisible1(true)}>Polityka Prywatności</a>
          <a href="#" onClick={() => setModalVisible(true)}>Pomoc</a>
          
        </div>
        
      </div>
      <ModalComponent isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
      <ModalPolityka isModalVisible1={isModalVisible1} setModalVisible1={setModalVisible1} />
      <ModalZasady isModalVisible2={isModalVisible2} setModalVisible2={setModalVisible2} />
      <ModalZwroty isModalVisible3={isModalVisible3} setModalVisible3={setModalVisible3} />
      <ModalCookie isModalVisible4={isModalVisible4} setModalVisible4={setModalVisible4} />
    </footer>
    
  );
}

export default Footer;


{/* <div className="group-botton" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={fasFaPlus} size="lg" style={{paddingRight: '7px', fontWeight: '800'}}/>
            Dodaj Restaurację
          </div> */}