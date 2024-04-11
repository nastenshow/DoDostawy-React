import React, { useState, useEffect } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

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
    let intervalId = null; // Declare a variable to hold the interval ID
  
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
  
        const visibleOrders = response.data
          .filter((order) => order.view === "1")
          .map((order) => ({
            ...order,
            view: true, // Now this is redundant as we filter only view === "1", but it's left for clarity
          }));
  
        const sortedOrders = visibleOrders.sort(
          (a, b) => new Date(b.datestart) - new Date(a.datestart)
        );
  
        setOrders(sortedOrders);
      } catch (error) {
        console.error("There was an error fetching the orders:", error);
      }
    };
  
    // Immediately invoke fetchOrders and also set an interval to refresh every 10 seconds
    fetchOrders();
    intervalId = setInterval(fetchOrders, 10000);
  
    // Clear the interval when the component is unmounted
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);





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


  };

  const fetchOrderDetails1 = (orderNumber) => {
    const selectedOrder = orders.find((order) => order.id === orderNumber);
    if (!selectedOrder) {
      console.error("Order not found");
      return;
    }

    // Відкриваємо перший URL
    if (selectedOrder.url) {
        window.open(selectedOrder.url_rozsze, "_blank");
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
              <th>Rozliczenia</th>
              <th>Szczegółowe Rozliczenia</th>
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
                      icon={faFileImport}
                      size="lg"
                      style={{ paddingLeft: "12px", fontWeight: "800" }}
                      onClick={() => fetchOrderDetails1(order.id)}
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
  onPageChange={(page) => setCurrentPage(page)}
/>
    </>
  );
};

export default TableOrder;
