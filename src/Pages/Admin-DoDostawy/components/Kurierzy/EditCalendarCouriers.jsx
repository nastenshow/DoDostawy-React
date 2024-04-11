import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

registerLocale("pl", pl);
setDefaultLocale("pl");

const apiUrl = import.meta.env.VITE_LINK;

function ModalEditComponentCalendar({
  isModalVisible,
  setModalVisible,
  courierId,
  selectedDate, // Accept the selectedDate prop
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(selectedDate || new Date());
  const [hours, setHours] = useState("");
  const [earning, setEarning] = useState("");
  const [couriers, setCouriers] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // Отримуємо ключ для дешифрування з змінних середовища
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  // Функція для дешифрування токену
  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      const token = decryptToken(encryptedToken);
      if (!token || !courierId) return;

      try {
        const response = await fetch(
          `${apiUrl}api/courier-schedule?courier_id=${courierId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching schedule");
        }

        const [scheduleData] = await response.json();
        if (scheduleData) {
          
          setDate(new Date(scheduleData.date));
          setHours(scheduleData.hours);
          setScheduleId(scheduleData.id);
        }
      } catch (error) {
        console.error("Error loading schedule:", error);
      }
    };

    fetchScheduleData();
  }, [courierId, selectedDate]);


  useEffect(() => {
    const fetchCouriers = async () => {
      const token = decryptToken(encryptedToken);
      try {
        const response = await fetch(`${apiUrl}api/courierslist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching couriers");
        }
        const data = await response.json();

        setCouriers(data); // Припускаючи, що список кур'єрів знаходиться в data.couriers
      } catch (error) {
        console.error("Error loading couriers:", error);
      }
    };

    fetchCouriers();
  }, []);

  function calculateHours(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes);

    const diff = (endDate - startDate) / (1000 * 60 * 60); // Різниця у годинах
    return diff >= 0 ? diff : 0; // Повертаємо 0, якщо різниця від'ємна
  }

  // ... інша частина вашого компонента ...

  useEffect(() => {
    if (startTime && endTime) {
      const hoursCalculated = calculateHours(startTime, endTime);
      setHours(hoursCalculated);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (couriers.length > 0 && hours) {
      const selectedCourier = couriers.find((c) => c.id === Number(courierId));
      if (selectedCourier) {
        const hourlyRate = parseFloat(selectedCourier.hourly_rate) || 0;
        const hoursNumber = parseFloat(hours) || 0;
        setEarning(hourlyRate * hoursNumber);
      }
    }
  }, [couriers, courierId, hours, selectedDate]);

  const handleSubmit = async () => {
    const postData = {
      start_time: startTime,
      end_time: endTime,
      earnings: earning.toFixed(2).toString(),
      date: date.toISOString().split("T")[0],
      hours: hours.toString(),
    };
    
    try {
        const endpoint = `${apiUrl}api/editcourier-schedule/${scheduleId}`;
    const token = decryptToken(encryptedToken);

    const response = await fetch(endpoint, {
        method: "PUT", // Зміна на PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Success:", data); // This should be after getting the response data
      alert("Zmianie uległy godziny pracy kurierów.");
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
        console.error("Error updating schedule:", error);
        if (error.response) {
          console.log("Server Response:", error.response.data);
        }
      }
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h1>Edytuj Harmonogram Kurierów</h1>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setModalVisible(false)}
              className="icon-mark"
              style={{
                paddingLeft: "7px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            />
          </div>
          <div className="modal-body">
            <div className="modal-column">
              {/* Ліва колонка інпутів */}
              <div className="input-group">
                <label style={{ zIndex: "2" }}>Wybierz Kuriera</label>
                <select
                  disabled
                  value={courierId}
                  onChange={(e) => setCourierId(e.target.value)}
                >
                  <option value="">Wybierz kuriera</option>
                  {couriers &&
                    Array.isArray(couriers) &&
                    couriers.map((courier, index) => (
                      <option key={index} value={courier.id}>
                        {courier.first_name} {courier.last_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-group">
                <label>Godzina Zakończenia</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Zarobek dzienny na godzinę</label>
                <input type="number" value={Number(earning).toFixed(2)} disabled />
              </div>
            </div>

            <div className="modal-column">
              {/* Права колонка інпутів */}
              <div className="input-group">
                <label>Godzina Rozpoczęcia</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Ilość Godzin</label>
                <input
                  type="number"
                  disabled
                  value={typeof hours === "number" ? hours.toFixed(2) : 0}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Podaj ilość godzin"
                />
              </div>

              <div className="input-group">
                <label style={{ zIndex: "1" }}>Data</label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="custom-button" onClick={handleSubmit}>
            Zmień Dane
            </button>
            <button
              className="cancel-button"
              onClick={() => setModalVisible(false)}
            >
              Anulować
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalEditComponentCalendar;
