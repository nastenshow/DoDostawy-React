import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CryptoJS from "crypto-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
const apiUrl = import.meta.env.VITE_LINK;
function generateTimeOptions() {
  const options = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = String(i).padStart(2, "0");
      const minutes = String(j).padStart(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  return options;
}

function ModalComponentEditOrder({
  isModalVisible,
  setModalVisible,
  orderDetails,
  setOrders,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [phone_number, setphone_number] = useState("");
  const [street, setStreet] = useState("");

  const [apartment_number, setApartmentNumber] = useState("");
  const [city, setCity] = useState("Rzeszów");
  const [amount, setAmount] = useState("0,00 zł");
  const [delivery_time, setDelivery_time] = useState(
    "Tak szybko, jak to możliwe"
  );
  const [order_size, setOrder_size] = useState("");
  const [description, setDescription] = useState("");
  const [rateUpTo6km, setRateUpTo6km] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [rateAbove6km, setRateAbove6km] = useState("");
  const [delivery_fee, setDelivery_fee] = useState(0);
  const [rateOutsideZone, setRateOutsideZone] = useState("");
  const [completion_date, setCompletion_date] = useState("");
  const [house_number, sethouse_number] = useState("");
  const [kilometry, setKilometry] = useState("");
  const [karta, setKarta] = useState("");
  const [gotuwka, setGotuwka] = useState("");
  const [status, setStatus] = useState("");
  const [termin_realizacji, setTermin_realizacji] = useState("");
  const [formatted_created_at, setFormatted_created_at] = useState("");

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // Отримуємо ключ для дешифрування з змінних середовища
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  // Функція для дешифрування токену
  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handlePhoneNumberChange = (e) => {
    const inputVal = e.target.value;
    const rawNumber = inputVal.replace(/\D/g, ""); // видаляємо всі не-цифри

    // Якщо користувач хоче стерти "+48", дозволимо це зробити
    if (inputVal.length === 3) {
      // змінено з 2 на 3 для розпізнавання "+48 "
      setphone_number("");
      return;
    }

    // Якщо номер складається більше ніж з 11 цифр, не змінюємо стан
    if (rawNumber.length > 11) return;

    let formattedNumber = "+48 "; // додано пробіл після "+48"
    const rawWithoutCountryCode = rawNumber.substring(2);

    for (let i = 0; i < rawWithoutCountryCode.length; i++) {
      if (i === 3 || i === 6) {
        formattedNumber += " ";
      }
      formattedNumber += rawWithoutCountryCode[i];
    }

    setphone_number(formattedNumber);
  };

  const handleBlur = (e) => {
    let inputVal = e.target.value.replace(" zł", "").replace(",", ".");
    let floatValue = parseFloat(inputVal);

    if (!isNaN(floatValue)) {
      setValue(floatValue.toFixed(2).replace(".", ",") + " zł");
    } else {
      setValue("0,00 zł");
    }
  };

  useEffect(() => {
    console.log("useEffect for orderDetails is running", orderDetails);
    if (orderDetails && orderDetails.order) {
      console.log("Setting selectedOrder:", orderDetails.order);
      setSelectedOrder(orderDetails.order);
      //   setStatus(orderDetails.order.status || '');
      // ... оновлення інших полів ...
      setSelectedOrder(orderDetails.order);
      setphone_number(orderDetails.order.phone_number || "");
      setStatus(orderDetails.order.status || "");

      setStreet(orderDetails.order.street || "");
      setApartmentNumber(orderDetails.order.apartment_number || "");
      setCity(orderDetails.order.city || "Rzeszów");
      setAmount(orderDetails.order.amount || "0,00 zł");
      setDelivery_time(
        orderDetails.order.delivery_time || "Tak szybko, jak to możliwe"
      );
      setOrder_size(orderDetails.order.order_size || "");
      setDescription(orderDetails.order.description || "");
      setRateUpTo6km(orderDetails.order.rateUpTo6km || "");
      setPayment_method(orderDetails.order.payment_method || "");
      sethouse_number(orderDetails.order.house_number || "");
      setRateAbove6km(orderDetails.order.rateAbove6km || "");
      setDelivery_fee(orderDetails.order.delivery_fee || 0);
      setRateOutsideZone(orderDetails.order.rateOutsideZone || "");
      setCompletion_date(orderDetails.order.completion_date || "");
      setKilometry(orderDetails.order.kilometry || "");
      setKarta(orderDetails.order.karta || "");
      setGotuwka(orderDetails.order.gotuwka || "");
      setTermin_realizacji(orderDetails.order.termin_realizacji || "");
      setFormatted_created_at(orderDetails.order.formatted_created_at || "");
    }
  }, [orderDetails]);

  useEffect(() => {
    console.log("selectedOrder now:", selectedOrder);
  }, [selectedOrder]);

  const handleSaveChanges = async () => {
    console.log("Selected order before PUT request:", selectedOrder);
    if (!selectedOrder || selectedOrder.order_number === undefined) {
      console.error(
        "Selected order is undefined or does not have an order_number."
      );
      alert("Nie można zaktualizować zamówienia bez numeru zamówienia.");
      return;
    }
    const orderData = {
      phone_number,
      house_number,
      status,
      street,
      apartment_number,
      city,
      amount,
      delivery_time,
      order_size,
      description,
      payment_method,
      delivery_fee,
      completion_date,
      kilometry,
      rateAbove6km,
      rateUpTo6km,
      rateOutsideZone,
      karta,
      gotuwka,
      termin_realizacji,
      formatted_created_at,
      // ... інші поля ...
    };

    try {
      const token = decryptToken(encryptedToken);
      const response = await axios.put(
        `${apiUrl}api/orders/${selectedOrder.order_number}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, ...orderData } : order
          )
        );
        setModalVisible(false); // Закрити модальне вікно
        alert("Zamówienie zostało zaktualizowane.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Nie udało się zaktualizować zamówienia.");
    }
  };

  const calculateCompletionTime = (createdTime, completionTime) => {
    const createdDate = new Date(createdTime);
    const completionDate = new Date(completionTime);

    // Різниця в часі в мілісекундах
    const difference = completionDate - createdDate;

    // Конвертуємо різницю у години, хвилини та секунди
    let hours = Math.floor(difference / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Додаємо ведучі нулі якщо потрібно
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };
  // Використовуємо цю функцію для визначення часу реалізації
  useEffect(() => {
    if (
      selectedOrder &&
      selectedOrder.formatted_created_at &&
      selectedOrder.completion_date
    ) {
      const completionTime = calculateCompletionTime(
        selectedOrder.formatted_created_at,
        selectedOrder.completion_date
      );
      // Встановлюємо час реалізації у стан або виводимо його де-інде в компоненті
      setTermin_realizacji(completionTime);
    }
  }, [selectedOrder]);

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Szczegóły Zamówienia</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible(false)}
            className="icon-mark"
            style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
          />
        </div>
        <div className="modal-body">
          <div className="modal-column">
            {/* Left column inputs */}
            <div className="input-group">
              <label>Numer telefonu</label>
              <PhoneInput
                international
                defaultCountry="PL"
                value={phone_number}
                onChange={setphone_number}
                placeholder="Wpisz numer telefonu"
                className="phone-input-hide-country-select"
                countrySelectProps={{ style: { display: "none" } }}
              />
            </div>

           
            <div className="input-group">
              <label>Miejscowość</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Podaj miasto"
                disabled
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Nr Mieszkania</label>
              <input
                type="text"
                value={apartment_number}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="Podaj numer mieszkania"
                disabled
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Czas dostawy</label>

              <select
                value={delivery_time}
                onChange={(e) => setDelivery_time(e.target.value)}
              >
                <option>Tak szybko, jak to możliwe</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Opis</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opisz, co zostanie dostarczone"
              />
            </div>
            <div className="input-group">
              <label>Metoda płatności</label>
              <input
                type="text"
                value={payment_method}
                onChange={(e) => setPayment_method(e.target.value)}
                disabled
                readOnly
              />

              {/* <select value={payment_method} onChange={e => setPayment_method(e.target.value)}>
                            <option value="" disabled>Wybierz metodę płatności</option>
                            <option value="gotówka">Gotówka</option>
                            <option value="karta">Karta</option>
                            <option value="przelew">Karta i Gotówka</option>
    
                        </select> */}
            </div>
            <div className="input-group">
              <label>Opłata za dostawę</label>
              <input
                type="number"
                value={delivery_fee}
                onChange={(e) => setDelivery_fee(e.target.value)}
                placeholder="Brak danych"
                disabled
                readOnly
              />
            </div>
            <div className="input-group">
              <label>Godzina realizacji zamówienia</label>
              <input
                type="text"
                value={completion_date}
                onChange={(e) => setCompletion_date(e.target.value)}
                placeholder="Brak danych"
                disabled
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Karta</label>
              <input
                type="text"
                value={karta}
                onChange={(e) => setKarta(e.target.value)}
                placeholder="Brak danych"
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="modal-column">
            {/* Right column inputs */}
            <div className="input-group">
              <label>Ulica</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Podaj ulicę"
                disabled
                readOnly
              />
            </div>
            <div className="input-group">
              <label>Nr Budynku</label>
              <input
                type="text"
                value={house_number}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="Podaj numer mieszkania"
                disabled
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Kwota</label>
              <input
                type="text"
                value={amount}
                onBlur={handleBlur}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label style={{ zIndex: "5" }}>Wielkość Zamówienia</label>
              <select
                value={order_size}
                onChange={(e) => setOrder_size(e.target.value)}
                disabled
                readOnly
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>
            </div>

            <div className="input-group">
              <label>Kilometry</label>
              <input
                type="text"
                value={kilometry}
                onChange={(e) => setKilometry(e.target.value)}
                placeholder="Brak danych"
                disabled
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Czas Realizacji Zamówienia</label>
              <input
                type="text"
                value={termin_realizacji}
                onChange={(e) => setTermin_realizacji(e.target.value)}
                disabled
                placeholder=""
                readOnly
              />
            </div>

            <div className="input-group">
              <label style={{ zIndex: "2" }}>Status Zamówienia</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled
              >
                <option value="Oczekujących">Oczekujących</option>
                <option value="Zrealizowane">Zrealizowane</option>
                <option value="Realizacji">W Realizacji</option>
                <option value="Anulowane">Anulowane</option>
                <option value="Reklamacja">Reklamacja</option>
                <option value="Nie_Dostarczono">Nie Dostarczono</option>
              </select>
            </div>

            <div className="input-group">
              <label>Gotówka</label>
              <input
                type="text"
                value={gotuwka}
                onChange={(e) => setGotuwka(e.target.value)}
                placeholder="Brak danych"
                disabled
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="custom-button"
            onClick={handleSaveChanges}
            disabled={!selectedOrder}
          >
            Zmień Dane
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

export default ModalComponentEditOrder;
