import React, {useState, useEffect} from "react";
import {pl} from "date-fns/locale";
import DatePicker from "react-datepicker";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
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
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(true); // Add this line
    const [orders, setOrders] = useState([]);
    const [netIncome, setNetIncome] = useState(0);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [couriers, setCouriers] = useState([]);
    const [courierSchedules, setCourierSchedules] = useState([]);
    const [couriersAdditionalEarnings, setCouriersAdditionalEarnings] = useState(
        {}
    );
    const [ordersPerCourier, setOrdersPerCourier] = useState({});



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
                    setOrdersPerCourier(response.data.ordersPerCourier);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false);

        };

        fetchOrders();
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchCouriers = async () => {
            const token = decryptToken();
            if (!token) {
                console.error("Token is not available or invalid");
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}api/courierslist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setCouriers(response.data); // Assuming the data is an array of couriers
                }
            } catch (error) {
                console.error("Error fetching couriers:", error);
            }
        };

        fetchCouriers();
    }, []);

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


    const calculateTotalEarnings = (courierId) => {
        const schedules = courierSchedules.filter(
            (schedule) => schedule.courier_id === courierId
        );
        const total = schedules.reduce((total, schedule) => {
            const earnings = parseFloat(schedule.earnings);
            return total + (isNaN(earnings) ? 0 : earnings);
        }, 0);
        return total.toFixed(2);
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
                    <div className="card-value">{netIncome.toFixed(2)} zł</div>
                    <div className="card-label">Dochód netto</div>
                  </>
              )}
            </div>
            <div className="card">
              {isLoading ? (
                  <div className="loading-spinner"></div>
              ) : (
                  <>
                    <div className="card-value">{(netIncome * 1.23).toFixed(2)} zł</div>
                    <div className="card-label">Dochód brutto</div>
                  </>
              )}
            </div>
            <div className="card">
              {isLoading ? (
                  <div className="loading-spinner"></div>
              ) : (
                  <>
                    <div className="card-value">{totalOrdersCount} zł</div>
                    <div className="card-label">Obrót</div>
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

          <div className="analytics-cards-col">
            <div className="card1-table-1">
              <div style={{paddingTop: "20px"}} className="group-text">
                Informacja o Kurierach
              </div>
              <table className="couriers-table1">
                <thead>
                <tr>
                  <th>Imię i Nazwisko:</th>
                  <th>Wynagrodzenie za godzinę pracy:</th>
                  <th>Dodatkowe wynagrodzenie za zamówienie:</th>
                    <th>Ilość zleceń:</th> {/* New column for number of orders */}
                  <th>Razem:</th>
                </tr>
                </thead>
                <tbody>
                {couriers.map((courier) => {
                    const fullName = `${courier.first_name} ${courier.last_name}`;
                    const earnings = calculateTotalEarnings(courier.id);
                    const additionalEarnings = couriersAdditionalEarnings[fullName] || 0;
                    const ordersCount = ordersPerCourier[fullName] || 0; // Default to 0 if no data

                  return (
                      <tr key={courier.id}>
                                    <td>{fullName}</td>
                                    <td>{earnings} zł</td>


                                    <td>{additionalEarnings.toFixed(2)} zł</td>
                          <td>{ordersCount}</td> {/* Displaying the number of orders */}
                                    <td>
                                        {(parseFloat(earnings) + additionalEarnings).toFixed(2)}{" "}
                                        zł
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analityka;
