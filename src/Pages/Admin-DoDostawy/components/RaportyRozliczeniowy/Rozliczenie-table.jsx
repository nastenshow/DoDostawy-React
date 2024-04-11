import React, { useState, useEffect } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

import ModalComponentRozliczenie from "./Rozliczenie-Make.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRotateRight,
  faXmark,
  faFileImport,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;
const linkrozliczenie = import.meta.env.VITE_LINK_ROZLICZENIE;

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
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(30);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = orders.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(orders.length / recordsPerPage);


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

  useEffect(() => {
    const fetchOrders = async () => {
      const token = decryptToken();
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}api/get-rozliczenie`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        // Convert '1'/'0' to true/false for the view property
        const convertedOrders = response.data.map(order => ({
          ...order,
          view: order.view === '1' // Convert '1' to true, '0' or any other string to false
        }));
      
        // Sort orders and update state
        const sortedOrders = convertedOrders.sort(
          (a, b) => new Date(b.datestart) - new Date(a.datestart)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error("There was an error fetching the orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleGeneratePDF = async (
    restaurantId,
    startDate,
    endDate,
    name_restaurant
  ) => {
    const token = decryptToken();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Використання переданих startDate та endDate замість статичних значень
      const response1 = await axios.get(
        `${apiUrl}api/generate-pdf/${restaurantId}?start_date=${startDate}&end_date=${endDate}`,
        config
      );
      const response2 = await axios.get(
        `${apiUrl}api/generate-pdf-all/${restaurantId}?start_date=${startDate}&end_date=${endDate}`,
        config
      );

      // Припускаємо, що API повертає назву файлу у відповіді
      const name1 = response1.data.name;
      const name2 = response2.data.name;

      console.log(name2);

      // Відправка інформації на /upload-file API, включаючи url_rozsze
      const uploadConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const uploadResponse = await axios.post(
        `${apiUrl}api/upload-file`,
        {
          restaurant_id: restaurantId,
          view: "false",
          url: `${linkrozliczenie}/${name1}`,
          url_rozsze: `${linkrozliczenie}/${name2}`, // Додано url_rozsze
          datestart: startDate,
          dateend: endDate,
          name_restaurant: name_restaurant,
        },
        config
      );

      if (uploadResponse.status === 200) {
        // Якщо відповідь від сервера позитивна, показуємо повідомлення
        alert("Rozliczenia zostały wygenerowany pomyślnie");
      } else {
        // Якщо щось пішло не так, можемо відобразити інше повідомлення
        alert("Wystąpił błąd podczas generowania rozliczeń.");
      }
    } catch (error) {
      console.error("There was an error:", error);
      alert("Wystąpił błąd. Proszę spróbuj ponownie.");
    }
  };

  const fetchOrderDetails1 = async (orderNumber) => {
    const selectedOrder = orders.find((order) => order.id === orderNumber);
    if (!selectedOrder) {
      console.error("Order not found");
      return;
    }

    // Викликаємо handleGeneratePDF з даними з вибраного запису
    await handleGeneratePDF(
      selectedOrder.restaurant_id,
      selectedOrder.datestart,
      selectedOrder.dateend,
      selectedOrder.name_restaurant
    );
  };

  const fetchOrderDetails = (orderNumber) => {
    const selectedOrder = orders.find((order) => order.id === orderNumber);
    if (!selectedOrder) {
      console.error("Order not found");
      return;
    }

    // Відкриваємо перший URL
    if (selectedOrder.url) {
      window.open(selectedOrder.url, "_blank");
    }

    // Використовуємо setTimeout для відкриття другого URL з невеликою затримкою
    if (selectedOrder.url_rozsze) {
      setTimeout(() => {
        window.open(selectedOrder.url_rozsze, "_blank");
      }, 300); // Затримка 100 мс
    }
  };

  const deleteOrder = async (orderId) => {
    const token = decryptToken();
    console.log(orderId);
    if (!token) {
      console.log("No token found");
      return;
    }

    // Add a confirmation dialog
    const isConfirmed = window.confirm(
      "Czy na pewno chcesz usunąć to rozliczenie?"
    );
    if (!isConfirmed) {
      // If the user clicks "Cancel", exit the function
      console.log("Usunięcie rozliczeń anulowane przez użytkownika.");
      return;
    }

    try {
      await axios.delete(`${apiUrl}api/delete-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the order from the state to update the UI
      setOrders(orders.filter((order) => order.id !== orderId));
      alert("Rozliczenia zostały pomyślnie usunięte.");
    } catch (error) {
      console.error("There was an error deleting the order:", error);
      alert("Nie udało się usunąć rozliczenia. Proszę spróbuj ponownie.");
    }
  };

  const changeViewStatus = async (orderId, currentView) => {
    const token = decryptToken();
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}api/update-view/${orderId}`,
        {
          view: !currentView,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          
          
        }
      );

      // Update the orders state to reflect the change
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, view: !order.view };
        }
        return order;
      });

      setOrders(updatedOrders);
      alert("Status widoczności został zmieniony.");
    } catch (error) {
      console.error("There was an error updating the view status:", error);
      alert(
        "Nie udało się zmienić statusu widoczności. Proszę spróbuj ponownie."
      );
    }
  };

  return (
    <>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Nazwa Restauracji</th>
              <th>Okres Rozliczenia</th>
              <th>Pobrać</th>
              <th>Usunąć</th>
              <th>Widoczność</th>
            </tr>
          </thead>
          <tbody>
          {currentRecords.map((order) => (
              <tr key={order.id}>
                <td>{order.name_restaurant}</td>
                <td>
                  {order.datestart} - {order.dateend}
                </td>

                <td>
                  <div className="group-icons-edit1">
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      size="lg"
                      style={{ paddingLeft: "12px", fontWeight: "800" }}
                      onClick={() => fetchOrderDetails1(order.id)}
                    />

                    <FontAwesomeIcon
                      icon={faFileImport}
                      size="lg"
                      style={{ paddingLeft: "12px", fontWeight: "800" }}
                      onClick={() => fetchOrderDetails(order.id)}
                    />
                  </div>
                </td>

                <td>
                  <div className="group-icons-edit1">
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        paddingLeft: "18px",
                        paddingRight: "12px",
                        fontSize: "18px",
                        fontWeight: "800",
                      }}
                      onClick={() => deleteOrder(order.id)}
                    />
                  </div>
                </td>

                <td>
                  <button
                    className={
                      order.view ? "status-przywroc" : "status-niewidoczne"
                    }
                    onClick={() => changeViewStatus(order.id, order.view)}
                  >
                    {order.view ? "Widoczne" : "Nie Widoczne"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
    </>
  );
};

export default TableOrder;
