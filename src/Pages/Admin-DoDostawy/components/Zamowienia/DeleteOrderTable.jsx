import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ModalComponentEditOrder from './EditOrder.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faCheckCircle, faPenToSquare, faHourglassHalf, faSpinner, faXmark, faInfo, faBan, faClockRotateLeft, faPhoneVolume,faFlagCheckered, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';


import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const decryptToken = () => {
  
  const encryptedToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_token'))
    ?.split('=')[1];

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

const DeleteOrderTable = () => {

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState({});
  
  
  const iconForStatus = (status) => {
    switch (status) {
      case 'Oczekujących':
        return faPhoneVolume;
      case 'Zrealizowane':
        return faFlagCheckered;
      case 'Czekamy na potwierdzenie':
        return faHourglassHalf;
      case 'W Realizacji':
        return faSpinner;
      case 'Anulowane':
        return faBan;
      case 'Reklamacja':
        return faClockRotateLeft;
      case 'Nie Dostarczono':
        return faBan; // You might want to use a different icon for this status
      default:
        return null; // Return null if no icon should be displayed
    }
  };

  const StatusDisplay = ({ status }) => {
    const statusClass = `status-${status.toLowerCase().replace(/ /g, '')}`;
    const icon = iconForStatus(status);

    return (
      <span className={statusClass}>
        <FontAwesomeIcon icon={icon} style={{paddingRight: '7px', fontWeight: '800'}} />
        {status}
      </span>
    );
  };

  const showEditModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

// Припустимо, що є стан для зберігання вибраного замовлення
const fetchOrderDetails = async (orderNumber) => {
  const token = decryptToken();


  if (!token) {
    alert('Token is not available or invalid');
    return;
  }

  try {

    const response = await fetch(`${apiUrl}api/orders/${orderNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });


    if (!response.ok) throw new Error('Network response was not ok');

    const orderDetails = await response.json();
    console.log('Order details:', orderDetails); // Логуємо вміст відповіді

    setSelectedOrder(orderDetails);
    setModalVisible(true);
  } catch (error) {
    console.error('Error fetching order details:', error);
    alert('Nie udało się pobrać szczegółów zamówienia.');
  }
};

const deleteOrder = async (orderNumber) => {
    const token = decryptToken();
  if (!token) {
    alert('Token is not available or invalid');
    return;
  }

  try {
    // Запит до API для оновлення замовлення зі значенням delete_at = null
    const response = await axios.put(
      `${apiUrl}api/orders-restore/${orderNumber}`,
      { delete_at: null }, // Встановлюємо delete_at на null
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Оновлюємо стан orders
      setOrders((prevOrders) => {
        // Замінюємо замовлення з певним order_number на оновлене замовлення
        return prevOrders.map((order) => {
          if (order.order_number === orderNumber) {
            return { ...order, delete_at: null };
          }
          return order;
        });
      });

      alert('Zamowienia został przywrócony');
    }
  } catch (error) {
    console.error('Error restoring order:', error);
    alert('Nie udało się przywrócić zamówienia.');
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

    //   console.log('Response data:', response.data);

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
  const fetchOrders = async () => {
    const token = decryptToken();
    if (!token) {
      console.error('Token is not available or invalid');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}api/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      let data = await response.json();

      // Фільтрування замовлень з null у полі delete_at
      let filteredData = data.filter(order => order.delete_at !== null || order.delete_at === "");

      const twentyMinutesInMilliseconds = 10 * 60 * 1000;
      const currentTime = new Date();
      const excludedStatuses = [];

      // Додаткова фільтрація замовлень заснована на статусі та часі оновлення
      filteredData = filteredData.filter(order => {
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
      console.error("There was a problem with the fetch operation for orders:", error);
    }
  };

  fetchOrders();

  // Запуск інтервалу
  const intervalId = setInterval(fetchOrders, 5000);

  // Очищення інтервалу при демонтажі компонента
  return () => clearInterval(intervalId);
}, []);


  return (
    <>
    <div className="order-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Numer Zamówienia</th>
            <th>Numer Telefonu</th>
            <th>Ulica</th>
            <th>Wielkość Zamówienia</th>
            <th>Сzas dostawy</th>
            <th>Kwota</th>
            <th>Płatność</th>
            <th>Opis</th>
            <th>Data utworzenia</th>
            <th>Godzina realizacji zamówienia</th>
            <th>Kurier</th>
            <th>Zostanie usunięty</th>
            {/* <th><FontAwesomeIcon icon={faTrashCan} size="lg" style={{paddingLeft: '12px', paddingRight: '12px', fontWeight: '800'}}/></th> */}
          </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
            <tr key={order.order_number}>
            <td>
                
            </td>
            
         
              <td>{`${restaurants[order.restaurant_id] || ''}#${order.order_number}`}</td>
        
          
            <td>{order.phone_number}</td>
            <td>{`${order.street} ${order.house_number} ${
                  order.apartment_number ? "/ " + order.apartment_number : ""
                }, ${order.city}`}</td>
            <td>{order.order_size}</td>
            <td>{order.delivery_time}</td>
            <td>{`${order.amount} zł`}</td>
            <td>{order.payment_method}</td>
            <td>{order.description}</td>
            <td>{order.formatted_created_at}</td>
            <td>
                {
                  ['Zrealizowane', 'Anulowane', 'Reklamacja', 'Nie Dostarczono'].includes(order.status)
                  ? order.completion_date
                  : '---'
                }
            </td>
            <td>{order.kuriers}</td>
            <td>{order.delete_at}</td>
            <td>
                <div className='group-icons-edit'>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="lg"
                      style={{ paddingLeft: '12px', fontWeight: '800' }}
                      onClick={() => fetchOrderDetails(order.order_number)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCanArrowUp}
                      style={{ paddingLeft: '12px', paddingRight: '12px', fontSize:'22px', fontWeight: '800' }}
                      onClick={() => deleteOrder(order.order_number)}
                    />
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

export default DeleteOrderTable;