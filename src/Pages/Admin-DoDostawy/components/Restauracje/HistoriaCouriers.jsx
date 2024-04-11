import React, { useState, useEffect, useRef } from "react";
import { Resizable } from "react-resizable";
import { useParams } from "react-router-dom";
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
  faXmark,
  faTruck,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import ModalComponentEditOrder from "../Zamowienia/EditOrder.jsx";
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

const HistoriaCouriers = ({
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
  const { firstName, lastName } = useParams();
  const { courierId } = useParams();
  const [additionalCompensation, setAdditionalCompensation] = useState(0);

  const prevOrdersRef = useRef([]); // useRef to keep track of the previous orders state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
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


  const fetchOrderDetails = async (orderNumber) => {
    const token = decryptToken();

    if (!token) {
      alert("Token is not available or invalid");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}api/orders/${orderNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const orderDetails = await response.json();

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
        console.error("Token is not available or invalid");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}api/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log('Response data:', response.data);

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

  const fetchOrders = async (
    start,
    end,
    page,
    sortOrder = "desc", // Переконайтеся, що sortOrder має значення 'asc' або 'desc'
    street = ''
  ) => {
    const token = decryptToken();

    if (!token) {
      return;
    }

    const offset = (page - 1) * ordersPerPage;
  const courierName = encodeURIComponent(`${firstName} ${lastName}`.trim());
  let queryParams = `?limit=${ordersPerPage}&offset=${offset}&sort_order=${sortOrder}&courier_name=${courierName}`;

  if (street.trim()) {
    queryParams += `&street=${encodeURIComponent(street)}`;
    console.log(`Searching for orders on street: ${street}`);
  }

    if (start && end) {
      const startDateTime = new Date(start);
      startDateTime.setDate(startDateTime.getDate() + 1);
      startDateTime.setHours(0, 0, 0);
      const startDateString = startDateTime.toISOString().split("T")[0];

      const endDateTime = new Date(end);
      endDateTime.setDate(endDateTime.getDate());
      endDateTime.setHours(23, 59, 59);
      const endDateString = endDateTime.toISOString().split("T")[0];

      queryParams += `&start_date=${startDateString}&end_date=${endDateString}`;
    }

    try {
      const response = await fetch(`${apiUrl}api/ordershistorycouriers${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const fullName =
        firstName && lastName ? `${firstName} ${lastName}`.trim() : ""; // Створюємо повне ім'я для порівняння

      console.log("Повне ім'я:", fullName);

      const filteredOrders = data.orders.filter((order) => {
        const statusCheck = [
          "Oczekujących",
          "W Realizacji",
          "Zrealizowane",
          "Anulowane",
          "Reklamacja",
          "Nie Dostarczono",
        ].includes(order.status);

        // Тут ми перевіряємо, чи рядок kuriers містить повне ім'я
        const courierCheck = order.kuriers && order.kuriers.includes(fullName);

        return statusCheck && courierCheck;
      });

      setTotalPages(Math.ceil(data.totalOrders / ordersPerPage));
      setOrders(filteredOrders);
      setDateRangeChanged(false);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation for orders:",
        error
      );
    }
  };

  useEffect(() => {
    const fetchCourierDetails = async () => {
      const token = decryptToken();
      if (!token) return;
  
      try {
        const response = await axios.get(`${apiUrl}api/couriers/${courierId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Припустимо, що ставка зберігається в полі additional_compensation
        const additionalCompensation = response.data.additional_compensation;
        // Збереження ставки в стан
        setAdditionalCompensation(additionalCompensation);
      } catch (error) {
        console.error("Error fetching courier details:", error);
      }
    };
  
    fetchCourierDetails();
  }, [courierId]);



  const calculateTotalEarnings = () => {
    const totalOrders = orders.length; // Або отримати цю інформацію з API
    const totalEarnings = totalOrders * additionalCompensation;
    return totalEarnings;
  };
  
  useEffect(() => {
    if (orders.length > 0) {
      // Once the orders are fetched and the state is updated, calculate the total earnings
      const earnings = calculateTotalEarnings();
      setTotalEarnings(earnings);
    }
  }, [orders]);

  
  // Використання у компоненті
  // const totalEarnings = calculateTotalEarnings();


  useEffect(() => {
    // Reset to the first page when search criteria changes
    setCurrentPage(1);
    // Call fetchOrders with an empty string if searchStreet is cleared
    fetchOrders(startDate, endDate, 1, 'desc', searchStreet.trim());
  }, [searchStreet]);


  useEffect(() => {
    fetchOrders(null, null, 1); // Завантаження всіх замовлень
  }, []);

  useEffect(() => {
    if (dateRangeChanged) {
      setCurrentPage(1);
        fetchOrders(startDate, endDate, 1, 'desc', searchStreet);
      
      // fetchOrders();
    }
  }, [startDate, endDate, dateRangeChanged]);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <>
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

     
      </>
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
              
              <th>Kwota</th>
              <th>Płatność</th>
              <th>Opis</th>
              <th>Data utworzenia</th>
              
              <th>Cena dostawy</th>
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
              
                <td>{`${order.amount} zł`}</td>
                <td>{order.payment_method}</td>
                <td>{order.description}</td>
                <td>{order.formatted_created_at}</td>
                

                <td>{`${order.delivery_fee ? order.delivery_fee : "0,00"} zł`}</td>
                <td>
                  <div className="group-icons-edit">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="lg"
                      style={{
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        fontWeight: "800",
                      }}
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

export default HistoriaCouriers;
