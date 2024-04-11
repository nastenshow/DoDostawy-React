import React, { useState, useEffect, useRef } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faPenToSquare,
  faCheckCircle,
  faSpinner,
  faInfo,
  faBan,
  faClockRotateLeft,
  faPhoneVolume,
  faTruck,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";

import ModalComponentEditOrder from "./InfoOrder.jsx";
import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

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

const TableOrder = () => {
  const [orders, setOrders] = useState([]);
  const prevOrdersRef = useRef([]); // useRef to keep track of the previous orders state
  const notificationSound = useRef(new Audio("/notification.mp3")); // Directly pass the URL of the audio file
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timerIds, setTimerIds] = useState({});
  const [restaurants, setRestaurants] = useState({});
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  const iconForStatus = (status) => {
    switch (status) {
      case "Oczekujących":
        return faPhoneVolume;
      case "Zrealizowane":
        return faFlagCheckered;
      case "W Realizacji":
        return faSpinner;
      case "Anulowane":
        return faBan;
      case "Reklamacja":
        return faClockRotateLeft;
      case "Nie Dostarczono":
        return faBan; // You might want to use a different icon for this status
      default:
        return null; // Return null if no icon should be displayed
    }
  };

  const StatusDisplay = ({ status }) => {
    const statusClass = `status-${status.toLowerCase().replace(/ /g, "")}`;
    const icon = iconForStatus(status);

    return (
      <span className={statusClass}>
        <FontAwesomeIcon
          icon={icon}
          style={{ paddingRight: "7px", fontWeight: "800" }}
        />
        {status}
      </span>
    );
  };

  // Function to play the notification sound

  // ... rest of your useEffect hooks ...

  const fetchOrderDetails = async (orderNumber) => {
    const token = decryptToken();


    if (!token) {
      alert("Token is not available or invalid");
      return;
    }

    try {
      console.log("Sending request to:", `${apiUrl}api/orders/${orderNumber}`); // Логуємо URL для перевірки
      const response = await fetch(`${apiUrl}api/orders/${orderNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status); // Логуємо статус відповіді
      if (!response.ok) throw new Error("Network response was not ok");

      const orderDetails = await response.json();
      console.log("Order details:", orderDetails); // Логуємо вміст відповіді

      setSelectedOrder(orderDetails);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Nie udało się pobrać szczegółów zamówienia.");
    }
  };

  //////////////////////////////////////////////////////// Сповіщення

  const shouldPlaySound = useRef(false); // Використовуємо useRef для контролю відтворення

  const playNotificationSound = () => {
    if (!shouldPlaySound.current) {
      console.log("Sound playback skipped");
      return;
    }

    console.log("Playing sound");
    const sound = new Audio("/notification.mp3");
    sound
      .play()
      .then(() => {
        console.log("Playback succeeded");
        // Запланувати повторне відтворення
        setTimeout(() => {
          if (shouldPlaySound.current) {
            playNotificationSound();
          }
        }, 10000);
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
      });
  };

  const fetchOrderStatus = async (orderNumber) => {
    try {
      const token = decryptToken();
      const response = await fetch(`${apiUrl}api/orders/${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json().then((data) => {
        console.log("Order status response for", orderNumber, ":", data);
        return data;
      });
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  useEffect(() => {
    const checkOrderStatus = async () => {
      const isAnyOrderWaitingForConfirmation = orders.some(
        (order) => order.status === "Czekamy na potwierdzenie"
      );

      if (isAnyOrderWaitingForConfirmation) {
        if (!shouldPlaySound.current) {
          shouldPlaySound.current = true;
          playNotificationSound();
        }
      } else {
        shouldPlaySound.current = false;
      }
    };

    checkOrderStatus(); // Виконати одразу при ініціалізації
    const intervalId = setInterval(checkOrderStatus, 10000); // Установка інтервалу

    return () => clearInterval(intervalId); // Очищення інтервалу
  }, [orders]);

  //////////////////////Закінчено сповіщення

  useEffect(() => {
    // Функція для отримання списку ресторанів
    const fetchRestaurants = async () => {
      const token = decryptToken();
      if (!token) {
        console.error("Token is not available or invalid");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}api/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response data:", response.data);

        if (response.status === 200) {
          // Створіть об'єкт, де ключами є ID ресторанів, а значеннями - назви
          const restaurantsMap = response.data.reduce((map, restaurant) => {
            map[restaurant.id] = restaurant.short_name;
            return map;
          }, {});
          setRestaurants(restaurantsMap);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = decryptToken();
      if (!token) {
        console.error("Token is not available or invalid");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}api/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();

        // Фільтрування замовлень з null у полі delete_at
        let filteredData = data.filter((order) => order.delete_at === null);

        const twentyMinutesInMilliseconds = 10 * 60 * 1000;
        const currentTime = new Date();
        const excludedStatuses = [
          "Zrealizowane",
          "Anulowane",
          "Reklamacja",
          "Nie Dostarczono",
        ];

        // Додаткова фільтрація замовлень заснована на статусі та часі оновлення
        filteredData = filteredData.filter((order) => {
          if (!excludedStatuses.includes(order.status)) {
            return true;
          }
          const timeSinceUpdate = currentTime - new Date(order.completion_date);
          return timeSinceUpdate < twentyMinutesInMilliseconds;
        });

        // Сортування даних
        const sortedData = filteredData.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        // Оновлення стану з відфільтрованими та відсортованими даними
        setOrders(sortedData);
      } catch (error) {
        console.error(
          "There was a problem with the fetch operation for orders:",
          error
        );
      }
    };

    fetchOrders();

    // Запуск інтервалу
    const intervalId = setInterval(fetchOrders, 5000);

    // Очищення інтервалу при демонтажі компонента
    return () => clearInterval(intervalId);
  }, []);

  const updateOrderStatus = async (orderNumber, newStatus) => {
    const token = decryptToken();
    if (!token) {
      console.error("Token is not available or invalid");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update the order status in the local state if the API response is successful
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_number === orderNumber
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error(
        "There was a problem with updating the order status:",
        error
      );
    }
  };

  useEffect(() => {
    const newRealizacjaOrders = orders.filter(
      (order) => order.status === "Realizacji"
    );
    newRealizacjaOrders.forEach((order) => {
      updateOrderStatus(order.order_number, "Czekamy na potwierdzenie");
    });
  }, [orders]);

  const handleShowStatus = (orderNumber) => {
    updateOrderStatus(orderNumber, "W Realizacji").then(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_number === orderNumber
            ? { ...order, status: "W Realizacji", statusButtonShown: false }
            : order
        )
      );
    });
  };

  return (
    <>
      {/* <button onClick={handleRequestNotificationPermission}>
      Zezwalaj na powiadomienia
      </button> */}
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Numer Zamówienia</th>
              <th>Numer Telefonu</th>
              <th>Ulica</th>
              <th>Сzas dostawy</th>
              <th>Kwota</th>
              <th>Płatność</th>
              <th>Opis</th>
              <th>Data utworzenia</th>
              <th>Godzina realizacji zamówienia</th>
              <th>Status</th>
              {/* <th><FontAwesomeIcon icon={faTrashCan} size="lg" style={{paddingLeft: '12px', paddingRight: '12px', fontWeight: '800'}}/></th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_number}>
                <td></td>

                <td>
                  {order.pyszne_id !== null ? (
                    <span className="status-pyszne">
                      <img
                        src="/takeaway.svg"
                        style={{
                          paddingRight: "4px",
                          paddingLeft: "2px",
                          width: "18px",
                          fontWeight: "800",
                        }}
                        onClick={() => fetchOrderDetails(order.order_number)}
                        alt="Your SVG Icon"
                      />
                      {restaurants[order.restaurant_id] || ""}#
                      {order.order_number}
                    </span>
                  ) : (
                    <span className="status-none-pyszne">
                      <FontAwesomeIcon
                        icon={faTruck}
                        style={{ paddingRight: "7px", fontWeight: "800" }}
                      />
                      {restaurants[order.restaurant_id] || ""}#
                      {order.order_number}
                    </span>
                  )}
                </td>
                <td>{order.phone_number}</td>
                <td>{`${order.street} ${order.house_number} ${
                  order.apartment_number ? "/ " + order.apartment_number : ""
                }, ${order.city}`}</td>
                <td>{order.delivery_time}</td>
                <td>{`${order.amount} zł`}</td>
                <td>{order.payment_method}</td>
                <td>{order.description}</td>
                <td>{order.formatted_created_at}</td>
                <td>
                  {[
                    "Zrealizowane",
                    "Anulowane",
                    "Reklamacja",
                    "Nie Dostarczono",
                  ].includes(order.status)
                    ? order.completion_date
                    : "---"}
                </td>
                <td>
                  {order.status === "Realizacji" ||
                  order.status === "Czekamy na potwierdzenie" ? (
                    <button
                      className="potwirdzic"
                      onClick={() => handleShowStatus(order.order_number)}
                    >
                      Potwierdzać
                    </button>
                  ) : (
                    <StatusDisplay status={order.status} />
                  )}
                </td>
                <td>
                  <div className="group-icons-edit">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="lg"
                      style={{ paddingLeft: "12px", fontWeight: "800" }}
                      onClick={() => fetchOrderDetails(order.order_number)}
                    />
                    {/* <FontAwesomeIcon icon={faPenToSquare} size="lg" style={{paddingLeft: '12px', fontWeight: '800'}}/> */}
                    {/* <FontAwesomeIcon icon={faXmark} style={{ paddingLeft: '12px', paddingRight: '12px',fontSize:'22px', fontWeight: '800' }} onClick={() => deleteOrder(order.order_number)}/> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalComponentEditOrder
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        orderDetails={selectedOrder}
        setOrders={setOrders} // Додано, щоб оновити стан orders після редагування
      />
    </>
  );
};

export default TableOrder;
