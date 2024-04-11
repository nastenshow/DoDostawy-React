import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import ModalEditCouriers from './EditCouriers.jsx';
import { useNavigate } from 'react-router-dom';
import {
  faHourglassStart,
  faCheckCircle,
  faPenToSquare,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const TableCourier = () => {
  const [couriers, setCouriers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); 
  const [selectedCourier, setSelectedCourier] = useState(null); 

  const decryptToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_token"))
      ?.split("=")[1];

    if (!cookieValue) {
      console.error("Token not found in cookies");
      return null;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(cookieValue, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Error decrypting token", e);
      return null;
    }
  };

  const navigate = useNavigate();

  const handleCourierClick = (courierId, firstName, lastName) => {
    navigate(`/dashboard-admin/kuriers/orders/${courierId}/${firstName}/${lastName}`);
  };

  useEffect(() => {
    const fetchCouriers = async () => {
      const token = decryptToken();
      if (!token) return;

      try {
        const response = await fetch(`${apiUrl}api/courierslist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
      
        let data = await response.json();
      
      // Сортування кур'єрів за зростаючим ID
      data = data.sort((a, b) => a.id - b.id);
        setCouriers(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCouriers();
  }, []);

  const handleEditCourier = async (courierId) => {
    const token = decryptToken();
    if (!token) return;
  
    try {
      const response = await fetch(`${apiUrl}api/couriers/${courierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const courier = await response.json();
  
      setSelectedCourier(courier);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching courier details:", error);
    }
  };

 
  return (
    <>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Numer Telefonu</th>
              <th>Email</th>
              <th>Rodzaj Umowy</th>
              <th>Pesel</th>
              <th>Data Dodania</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((courier, index) => (
              <tr key={index}>
                <td>{courier.id}</td>
                <td>{courier.first_name}</td>
                <td>{courier.last_name}</td>
                <td>{courier.phone_number}</td>
                <td>{courier.email}</td>
                <td>{courier.contract_type}</td>
                <td>{courier.pesel}</td>
                <td>{new Date(courier.created_at).toLocaleDateString()}</td>
               <td><button
                    className="group-botton"
                    onClick={() => handleEditCourier(courier.id)}
                  >
                    Zmień Dane
                  </button></td>
                  <td>
                  <FontAwesomeIcon
                    icon={faUpRightFromSquare}
                    size="lg"
                    style={{ paddingLeft: "12px", fontWeight: "800" }}
                    onClick={() => handleCourierClick(courier.id, courier.first_name, courier.last_name)}
                  />
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalEditCouriers
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        courierDetails={selectedCourier}
        setCouriers={setCouriers}
      />
    </>
  );
};

export default TableCourier;
