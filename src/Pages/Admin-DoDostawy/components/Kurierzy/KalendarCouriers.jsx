import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import ModalEditComponentCalendar from "./EditCalendarCouriers.jsx";
import { useNavigate } from "react-router-dom";
import {
  faHourglassStart,
  faCheckCircle,
  faPenToSquare,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const TableCourier = ({ selectedDate, schedules }) => {
  const [couriers, setCouriers] = useState([]);

  const [editCourierId, setEditCourierId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

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

  if (!selectedDate) {
    return <div>Please select a date to view couriers.</div>;
  }

  const navigate = useNavigate();

  const handleEditClick = (courierId) => {
    setEditCourierId(courierId); // Save the ID of the courier to edit
    setModalVisible(true); // Open the modal window
  };

  useEffect(() => {
    
    const fetchCouriers = async () => {
      const token = decryptToken();
      if (!token) return;

      try {
        // Отримання списку кур'єрів
        let response = await fetch(`${apiUrl}api/courierslist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Network response was not ok");

        let couriersData = await response.json();
        couriersData = couriersData.sort((a, b) => a.id - b.id);

        // Отримання графіків кур'єрів
        response = await fetch(`${apiUrl}api/courier-schedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Network response was not ok");

        const schedulesData = await response.json();

        // Збагачення даних кур'єрів інформацією про графіки
        const enrichedCouriers = couriersData.map((courier) => {
          const schedule = schedulesData.find(
            (s) => s.courier_id === courier.id
          );
          return {
            ...courier,
            workHours: schedule
              ? `${schedule.start_time} - ${schedule.end_time}`
              : "Brak danych",
            workDate: schedule ? schedule.date : "Brak danych",
          };
        });

        setCouriers(enrichedCouriers);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCouriers();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = decryptToken();
      if (!token) return;

      try {
        // Форматування вибраної дати для запиту
        const formattedDate = selectedDate.toISOString().split("T")[0];

        // Отримання графіків кур'єрів за обраною датою
        const response = await fetch(
          `${apiUrl}api/courier-schedule?date=${formattedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const schedulesData = await response.json();

        // Оновлення даних кур'єрів з урахуванням отриманих графіків
        const updatedCouriers = couriers.map((courier) => {
          const schedule = schedulesData.find(
            (s) => s.courier_id === courier.id
          );
          return {
            ...courier,
            workHours: schedule
              ? `${schedule.start_time} - ${schedule.end_time}`
              : "Brak danych",
            workDate: schedule ? schedule.date : "Brak danych",
          };
        });

        setCouriers(updatedCouriers);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    if (selectedDate) {
      console.log("Updating currentDate to:", selectedDate);
    setCurrentDate(selectedDate);
    fetchSchedules();
    }
  }, [selectedDate]);

  

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
              <th>Godziny Pracy</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          {currentDate && (
          <tbody>
          
            {couriers
              .filter((courier) => courier.workDate !== "Brak danych")
              .map((courier, index) => (
                <tr key={index}>
                  <td>{courier.id}</td>
                  <td>{courier.first_name}</td>
                  <td>{courier.last_name}</td>
                  <td>{courier.phone_number}</td>
                  <td>{courier.workHours}</td>
                  <td>{courier.workDate}</td>

                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="lg"
                      style={{ paddingLeft: "12px", fontWeight: "800" }}
                      onClick={() => handleEditClick(courier.id)}
                    />
                  </td>
                </tr>
              ))}
              
          </tbody>
          )}
        </table>
      </div>
      
      <ModalEditComponentCalendar
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        courierId={editCourierId}
        selectedDate={selectedDate} // Pass the selected date here
      />
    </>
  );
};

export default TableCourier;
