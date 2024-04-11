import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalEditRestaurants from './EditRestaurant.jsx';
import {
  faHourglassStart,
  faCheckCircle,
  faPenToSquare,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const RestauracjaList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [ws, setWs] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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

  const handleEditRestaurant = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) {
      console.error("Restaurant not found");
      return;
    }
  
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      // Читаємо кукі напряму з document.cookie
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_token"))
        ?.split("=")[1];

      let token = null;

      if (cookieValue) {
        try {
          const bytes = CryptoJS.AES.decrypt(cookieValue, secretKey);
          token = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
          console.error("Помилка при розшифровці токена", e);
          // Обробка помилки
          return;
        }
      }

      if (token) {
        try {
          const response = await fetch(`${apiUrl}api/restaurants`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
  
          // Сортування отриманих даних за датою створення
          const sortedData = data.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
          });
  
          setRestaurants(sortedData);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
      }
    };
  
    fetchRestaurants();
  }, []);

  const changeRestaurantStatus = async (restaurantId) => {
    const token = decryptToken();
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) {
      console.error("Restaurant not found");
      return;
    }

    // Визначення нового статусу
    let newStatus;
    if (restaurant.statuses === "Działa") {
      newStatus = "Nie Działa";
    } else {
      newStatus = "Działa";
    }

    // Відправка запиту на сервер для оновлення статусу
    try {
      const response = await fetch(
        `${apiUrl}api/restaurants/${restaurantId}/updateStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statuses: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update restaurant status");
      }

      // Оновлення стану компонента
      const updatedRestaurants = restaurants.map((r) =>
        r.id === restaurantId ? { ...r, statuses: newStatus } : r
      );
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
    }
  };

  const navigate = useNavigate();

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/dashboard-admin/restaurant/orders/${restaurantId}`);
  };

  return (
    <>
    <div className="order-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa Restauracje</th>
            <th>Numer Telefonu</th>
            <th>Ulica</th>
            <th>NIP</th>
            <th>Konto bankowe</th>
            <th>Poczta</th>
            <th>Działa w naszym systemie od</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant, index) => (
            <tr key={index}>
              <td>{restaurant.id}</td>
              <td>{restaurant.restaurantName}</td>
              <td>{restaurant.phoneNumber}</td>
              <td>{restaurant.street}</td>
              <td>{restaurant.nipValue}</td>
              <td>{restaurant.konto}</td>
              <td>{restaurant.email}</td>
              <td>{new Date(restaurant.created_at).toLocaleString()}</td>
              <td>{restaurant.statuses}</td>
              <td>
                <div className="group-icons-edit">
                  <button
                    className={
                      restaurant.statuses === "Nie Działa"
                        ? "status-przywroc"
                        : "status-niedostarczono"
                    }
                    onClick={() => changeRestaurantStatus(restaurant.id)}
                  >
                    {restaurant.statuses === "Nie Działa"
                      ? "Przywróć"
                      : "Usunąć"}
                  </button>
                  <button
                    className="group-botton"
                    onClick={() => handleEditRestaurant(restaurant.id)}
                  >
                    Zmień Dane
                  </button>
                  <FontAwesomeIcon
                    icon={faUpRightFromSquare}
                    size="lg"
                    style={{ paddingLeft: "12px", fontWeight: "800" }}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ModalEditRestaurants
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          restaurantDetails={selectedRestaurant}
          setRestaurants={setRestaurants} // Функція для оновлення списку ресторанів
        />
  </>
  );
};

export default RestauracjaList;
