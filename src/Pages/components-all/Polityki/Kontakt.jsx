import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../assets/Footer.css';



function ModalComponent({ isModalVisible, setModalVisible }) {


    if (!isModalVisible) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <div className="modal-header" style={{marginBottom:'-20px'}}>
                    <h1>Skontaktuj się z koordynatorem.</h1>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setModalVisible(false)} className='icon-mark' style={{paddingLeft: '7px', fontWeight: '800', cursor: 'pointer'}}/>
                    
                </div>
                <p>Jeśli masz problemy z platformą, możesz w każdej chwili skontaktować się z nami.</p>
                <h1>Numer telefonu: +48 578 571 498</h1>
                <h1>E-mail: dodostawy@gmail.com</h1>
                

            </div>
        </div>
    );
}

export default ModalComponent;