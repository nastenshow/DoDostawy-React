import React, {useState, useEffect} from "react";
import {pl} from "date-fns/locale";
import DatePicker from "react-datepicker";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPlus as fasFaPlus,
    faClockRotateLeft,
    faCalendarDays,
    faTruck,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/Order.css";
import "../assets/Analitics.css";
import "react-datepicker/dist/react-datepicker.css";
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
const Analityka = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isCourierListSelectVisible, setCourierListSelectVisible] =
        useState(false);
    const [isLoading, setLoading] = useState(true); // Add this line
    const [isModalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [netIncome, setNetIncome] = useState(0);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [couriers, setCouriers] = useState([]);
    const [courierSchedules, setCourierSchedules] = useState([]);
    const [couriersAdditionalEarnings, setCouriersAdditionalEarnings] = useState(
        {}
    );

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const token = decryptToken();
            if (!token) {
                console.error("Token is not available or invalid");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}api/orders-analitics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
                        endDate: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
                    },
                });

                if (response.status === 200) {
                    setOrders(response.data.orders);
                    setNetIncome(response.data.netIncome);
                    setTotalOrdersCount(response.data.totalOrdersCount);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [startDate, endDate]);


    useEffect(() => {
        const fetchCourierSchedules = async () => {
            const token = decryptToken();
            if (!token) {
                console.error("Token is not available or invalid");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}api/orders-analitics`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startDate: startDate.toISOString().split("T")[0],
                        endDate: endDate.toISOString().split("T")[0],
                    },
                });

                if (response.status === 200) {
                    setCourierSchedules(response.data.courierSchedules);
                    setCouriersAdditionalEarnings(
                        response.data.couriersAdditionalEarnings
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching analytics data:",
                    error.response ? error.response.data : error.message
                );
            }
        };

        fetchCourierSchedules();
    }, [startDate, endDate]);

    // Функція для обрахунку загального заробітку кур'єра
    const calculateTotalEarnings = (courierId) => {
        const schedules = courierSchedules.filter(
            (schedule) => schedule.courier_id === courierId
        );
        const total = schedules.reduce((total, schedule) => {
            const earnings = parseFloat(schedule.earnings); // Перетворюємо строку на число
            return total + (isNaN(earnings) ? 0 : earnings); // Додаємо до загальної суми, якщо це число
        }, 0);
        return total.toFixed(2); // Повертаємо суму з двома знаками після коми
    };

    return (
        <div className="order white-rounded-box">
            <div className="row">
                <div className="left-group">
                    <div className="group-text">Analityka zamówień</div>
                </div>

                <div className="input-group datepicker-group">
                    <FontAwesomeIcon
                        icon={faCalendarDays}
                        size="lg"
                        style={{paddingRight: "7px", fontWeight: "800"}}
                    />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => handleStartDateChange(date)}
                        dateFormat="yy-MM-dd"
                        customInput={<input type="text"/>}
                        locale={pl}
                    />
                    <span>-</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => handleEndDateChange(date)}
                        dateFormat="yy-MM-dd"
                        minDate={startDate}
                        customInput={<input type="text"/>}
                        locale={pl}
                    />
                </div>
            </div>



            <div className="analytics-cards">
                <div className="card">
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <>
                          <div className="card-value">{(netIncome * 1.23).toFixed(2)} zł</div>
                          <div className="card-label">Płatność za dostawę</div>
                        </>
                    )}
                </div>
                <div className="card">
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <>
                          <div className="card-value">{totalOrdersCount} zł</div>
                          <div className="card-label">Wartość Zleceń</div>
                        </>
                    )}
                </div>
              <div className="card">
                {isLoading ? (
                    <div className="loading-spinner"></div>
                    ) : (
                    <>
                      <div className="card-value">{orders.length}</div>
                      <div className="card-label">Ilość Zleceń</div>
                    </>
                )}
              </div>
            </div>


        </div>
    );
};

export default Analityka;
