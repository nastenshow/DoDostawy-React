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

function ModalComponentCalendar({ isModalVisible, setModalVisible }) {
  const [courierId, setCourierId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState("");
  const [earning, setEarning] = useState("");
  const [couriers, setCouriers] = useState([]);

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
    const selectedCourier = couriers.find(
      (courier) => courier.id.toString() === courierId
    );
    if (selectedCourier && typeof hours === "number") {
      const hourlyRate = parseFloat(selectedCourier.hourly_rate);
      setEarning(hourlyRate * hours);
    } else {
      setEarning(0);
    }
  }, [courierId, hours, couriers]);

  const handleSubmit = async () => {
    const postData = {
        courier_id: courierId,
        start_time: startTime,
        end_time: endTime,
        earnings: earning.toFixed(2).toString(), // Перетворення в рядок
        date: date.toISOString().split("T")[0],
        hours: hours.toString(), // Перетворення в рядок
    };

  

    try {
      const endpoint = `${apiUrl}api/addcalendarcourierslist`;
      const token = decryptToken(encryptedToken);

      const response = await fetch(endpoint, {
        method: "POST",
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
  
      alert("Dodano godziny pracy kuriera.");
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Błąd przy dodawaniu godzin dla kuriera:", error);
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
            <h1>Dodać Grafik Kuriera</h1>
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
                <label>Wybierz Kuriera</label>
                <select
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
                <input type="number" value={earning.toFixed(2)} disabled />
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
                <label style={{zIndex:"1"}}>Data</label>
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
              Dodać
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

export default ModalComponentCalendar;
