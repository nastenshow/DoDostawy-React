import React, { useState, useEffect, useRef } from "react";
import { Resizable } from "react-resizable";
import { useParams } from 'react-router-dom';
import "react-resizable/css/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faCheckCircle,
  faSpinner,
  faInfo,
  faBan,
  faClockRotateLeft,
  faPhoneVolume,
  faFlagCheckered,
  faTruck,
  faXmark,

  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import axios from 'axios';

import ModalComponentEditOrder from '../Zamowienia/EditOrder.jsx';
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

const HistoriaOrders = ({
  startDate: propStartDate,
  endDate: propEndDate,
  dateRangeChanged,
  setDateRangeChanged,
  searchStreet,
  fetchOrdersDebounced,
  handleStartDateChange,
  handleEndDateChange,
}) => {
  const [orders, setOrders] = useState([]);
  const prevOrdersRef = useRef([]); // useRef to keep track of the previous orders state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timerIds, setTimerIds] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [restaurants, setRestaurants] = useState({});
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);
  const { restaurantId } = useParams();

  const ordersPerPage = 30;

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

  useEffect(() => {
    // Функція для отримання списку ресторанів
    const fetchRestaurants = async () => {
      const token = decryptToken();
      if (!token) {
        console.error('Token is not available or invalid');
        return;
      }
  
      try {
        const response = await axios.get(`${apiUrl}api/restaurants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        console.log('Response data:', response.data);
  
        if (response.status === 200) {
          // Створіть об'єкт, де ключами є ID ресторанів, а значеннями - назви
          const restaurantsMap = response.data.reduce((map, restaurant) => {
            map[restaurant.id] = restaurant.short_name;
            return map;
          }, {});
          setRestaurants(restaurantsMap);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
  
    fetchRestaurants();
  }, []);


  useEffect(() => {
    const newAwaitingConfirmationOrders = orders.filter((order) => {
      const prevOrder = prevOrdersRef.current.find(
        (prev) => prev.order_number === order.order_number
      );
      return prevOrder
        ? order.status !== prevOrder.status &&
            order.status === "Czekamy na potwierdzenie"
        : false;
    });

    if (newAwaitingConfirmationOrders.length > 0) {
      newAwaitingConfirmationOrders.forEach(playRepeatNotification);
    }

    prevOrdersRef.current = orders;

    return () => {
      Object.values(timerIds).forEach(({ timerId, intervalId }) => {
        clearTimeout(timerId);
        clearInterval(intervalId);
      });
    };
  }, [orders, timerIds]);

  useEffect(() => {
    setStartDate(propStartDate);
    setEndDate(propEndDate);
  }, [propStartDate, propEndDate]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders(startDate, endDate, newPage);
  };

  
  
  const fetchOrders = async (start, end, page, sortOrder = 'desc', street = '') => {
    console.log("fetchOrders called with:", { start, end, page, sortOrder, street });
    const token = decryptToken();
    if (!token) {
      console.error("Token is not available or invalid");
      return;
    }
  
    const offset = (page - 1) * ordersPerPage;
  
    let queryParams = `?restaurant_id=${restaurantId}&limit=${ordersPerPage}&offset=${offset}`;
  queryParams += `&sort_order=${sortOrder}`;

    if (street.trim()) {
      queryParams += `&street=${encodeURIComponent(street)}`;
      console.log(`Searching for orders on street: ${street}`);
    }

    if (start && end) {
      // Додавання одного дня до startDateTime
      const startDateTime = new Date(start);
      startDateTime.setDate(startDateTime.getDate() + 1);
      startDateTime.setHours(0, 0, 0); // Встановлення початку дня для startDate
      const startDateString = startDateTime.toISOString().split("T")[0];
      
      // Віднімання одного дня від endDateTime
      const endDateTime = new Date(end);
      endDateTime.setDate(endDateTime.getDate());
      endDateTime.setHours(23, 59, 59); // Встановлення кінця дня для endDate
      const endDateString = endDateTime.toISOString().split("T")[0];
      
      queryParams += `&start_date=${startDateString}&end_date=${endDateString}`;
  
      console.log("Start Date UTC: ", startDateString, "End Date UTC: ", endDateString);
    }
  
    try {
      const response = await fetch(`${apiUrl}api/ordershistory${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      const filteredOrders = data.orders.filter(order => 
        ['Zrealizowane', 'Anulowane', 'Reklamacja', 'Nie Dostarczono'].includes(order.status)
      );
      setTotalPages(Math.ceil(data.totalOrders / ordersPerPage));
      setOrders(filteredOrders);
      setDateRangeChanged(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation for orders:", error);
    }
  };



  useEffect(() => {
    // Reset to the first page when search criteria changes
   
    // Call fetchOrders with an empty string if searchStreet is cleared
    fetchOrders(startDate, endDate, currentPage, 'desc', searchStreet.trim());
  }, [currentPage, searchStreet, ]);


  useEffect(() => {
    
    fetchOrders(null, null); // Завантаження всіх замовлень
  }, []);

  useEffect(() => {
    if (dateRangeChanged) {
 
      fetchOrders(startDate, endDate, currentPage, 'desc', searchStreet.trim());
      
 
    }
  }, [startDate, endDate, dateRangeChanged, searchStreet, currentPage,]);

  
  
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Poprzedni
        </button>
        <span>
          {currentPage} z {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Następny
        </button>
      </div>
    );
  };

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
      <div className="order-table">
        <table>
          <thead>
            <tr>
              
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
                <div className='group-icons-edit'>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="lg"
                      style={{ paddingLeft: '12px', paddingRight: '12px', fontWeight: '800' }}
                      onClick={() => fetchOrderDetails(order.order_number)}
                    />
                  
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <ModalComponentEditOrder
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        orderDetails={selectedOrder}
        setOrders={setOrders} // Додано, щоб оновити стан orders після редагування
      />
    </>
  );
};

export default HistoriaOrders;
