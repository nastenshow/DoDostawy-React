import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faEye,
  faEyeSlash,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { format } from "date-fns";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const apiUrl = import.meta.env.VITE_LINK;

const linkrozliczenie = import.meta.env.VITE_LINK_ROZLICZENIE;

const encryptedToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
  "$1"
);

const decryptToken = () => {
  const encryptedToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_token"))
    ?.split("=")[1];

  if (!encryptedToken) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const token = bytes.toString(CryptoJS.enc.Utf8);

    return token;
  } catch (e) {
    return null;
  }
};

function ModalComponentRozliczenie({ isModalVisible, setModalVisible }) {
  const [restaurantId, setRestaurantId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const authToken = decryptToken();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const handleGeneratePDF = async () => {
    try {
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";

      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };

      // Використання selectedRestaurant як restaurantId
      const restaurantId = selectedRestaurant;
      // Перетворення restaurantId у число для порівняння
      const numericRestaurantId = Number(restaurantId);
      // Отримання назви ресторану зі стану restaurants
      const restaurantName = restaurants.find(
        (r) => r.id === numericRestaurantId
      )?.restaurantName;

      // Ваш код для отримання інформації з API
      const response1 = await axios.get(
        `${apiUrl}api/generate-pdf/${restaurantId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
        config
      );
      const response2 = await axios.get(
        `${apiUrl}api/generate-pdf-all/${restaurantId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
        config
      );

      // Припускаємо, що API повертає назву файлу у відповіді
      const name1 = response1.data.name;
      const name2 = response2.data.name;

      // Відправка інформації на /upload-file API, включаючи url_rozsze
      const uploadResponse = await axios.post(
        `${apiUrl}api/upload-file`,
        {
          restaurant_id: restaurantId,
          view: "false",
          url: `${linkrozliczenie}/${name1}`,
          url_rozsze: `${linkrozliczenie}/${name2}`,
          datestart: formattedStartDate,
          dateend: formattedEndDate,
          name_restaurant: restaurantName, // Використання отриманої назви ресторану
        },
        config
      );

      if (uploadResponse.status === 200) {
        alert("Rozliczenia zostały wygenerowany pomyślnie");
        window.location.reload();
      } else {
        alert("Wystąpił błąd podczas generowania rozliczeń.");
      }
    } catch (error) {
      console.error("There was an error:", error);
      alert("Wystąpił błąd. Proszę spróbuj ponownie.");
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = decryptToken();

        console.log(token)
        const response = await axios.get(`${apiUrl}api/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  if (!isModalVisible || restaurants.length === 0) {
    return null; // or a loader/placeholder
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Dane Restauracji</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible(false)}
            className="icon-mark"
            style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
          />
        </div>
        <div className="modal-body" style={{ height: "420px" }}>
          <div className="modal-column">
            {/* Left column inputs */}
            <div className="input-group">
              <label>Nazwa Restauracji</label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              >
                <option value="">Wybierz restaurację</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label style={{ zIndex: "1" }}>Data końcowa</label>
              <DatePicker
                locale="pl"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
            </div>
          </div>
          <div className="modal-column">
            {/* Right column inputs */}

            <div className="input-group">
              <label style={{ zIndex: "1" }}>Data początkowa</label>
              <DatePicker
                locale="pl"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleGeneratePDF} className="custom-button">
            Generuj PDF
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
  );
}

export default ModalComponentRozliczenie;
