import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import CryptoJS from "crypto-js";
import MapBoxComponentRoute from "../Map/MapBoxComponentRoute.jsx";
import CitySelector from "../Map/CitySelector.jsx";
import StreetSelector from "../Map/StreetSelector.jsx";
import NumerBudynku from "../Map/NumerBudynkuAdmin.jsx";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

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
  restaurantId,
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
  const [pozastrefaorig, setPozastrefaorig] = useState("");
  const [payment_method, setPayment_method] = useState("");
  const [rateAbove6km, setRateAbove6km] = useState("");
  const [calculatedRateAbove6km, setCalculatedRateAbove6km] = useState("");
  const [delivery_fee, setDelivery_fee] = useState(0);
  const [rateOutsideZone, setRateOutsideZone] = useState("");
  const [completion_date, setCompletion_date] = useState("");
  const [house_number, sethouse_number] = useState("");
  const [kilometry, setKilometry] = useState("");
  const [karta, setKarta] = useState("");
  const [gotuwka, setGotuwka] = useState("");
  const [status, setStatus] = useState("");
  const [isCardCashDisabled, setIsCardCashDisabled] = useState(false);
  const [termin_realizacji, setTermin_realizacji] = useState("");
  const [formatted_created_at, setFormatted_created_at] = useState("");
  const [kuriers, setKuriers] = useState("");
  const [isAmountGreaterThanZero, setIsAmountGreaterThanZero] = useState(false);
  const [isKartaDisabled, setIsKartaDisabled] = useState(false);
  const [isGotuwkaDisabled, setIsGotuwkaDisabled] = useState(false);
  const [couriers, setCouriers] = useState([]);
  const [distance, setDistance] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [markerCoordinatesfirst, setMarkerCoordinatesfirst] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });
  const [secondMarkerPosition, setSecondMarkerPosition] = useState({
    lat: 50.04132,
    lng: 21.99901,
  });
  const [outsideDistance, setOutsideDistance] = useState(0);

  const [originalRates, setOriginalRates] = useState({
    rateUpTo6km: "",
    rateAbove6km: "",
    rateOutsideZone: "",
  });

  const [calculatedRateOutsideZone, setCalculatedRateOutsideZone] = useState(0); // Новий стан для зберігання розрахункової ставки

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // Отримуємо ключ для дешифрування з змінних середовища

  // Функція для дешифрування токену
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
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return null;
    }
  };

  const handleSetOutsideDistance = (distance) => {
    setOutsideDistance(distance);
    // Here you can also convert the distance to string and replace '.' with ',' if needed
    // Then you could pass it directly to the input field or wherever it's needed
  };

  const updateMapCoordinates = async (streetName, house_number) => {
    try {
      const token = decryptToken(encryptedToken);
      const url = `${apiUrl}api/street-coordinates?street=${encodeURIComponent(
        streetName
      )}&city=${encodeURIComponent(city)}&house_number=${encodeURIComponent(
        house_number
      )}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        setSecondMarkerPosition({
          lat: parseFloat(response.data.data.lat),
          lng: parseFloat(response.data.data.lon),
        });
      } else {
        // Якщо відповідь не містить очікуваних даних, обробляємо це як неуспішний пошук без виведення помилки
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (street && house_number) {
      // Додано перевірку на наявність номера будинку
      updateMapCoordinates(street, house_number);
    }
  }, [street, city, house_number]);

  useEffect(() => {
    const fetchInitialCoordinates = async () => {
      if (!selectedRestaurant || !selectedRestaurant.id) return;

      const token = decryptToken();
      if (!token) {
        console.error("Authentication token is not available");
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}api/restaurants-map-touch/${selectedRestaurant.id}/coordinates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.coordinates) {
          // Тут використовуємо response.data.coordinates для доступу до координат
          const { lat, lon } = response.data.coordinates;
          setMarkerCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.error("Invalid coordinates data received from server");
        }
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
      }
    };

    fetchInitialCoordinates();
  }, [selectedRestaurant, apiUrl]);

  const onMarkerDragEnd = async (lat, lng) => {
    try {
      // Use reverse geocoding to find the address from the coordinates
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const address = response.data.address;

      if (address) {
        // Update the city and street based on the reverse geocoding result
        setCity(address.city || address.town || address.village);
        setStreet(address.road || "");
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  const fetchRates = async () => {
    if (!selectedRestaurant) return; // Ensure there's a selected restaurant to fetch

    try {
      const endpoint = `${apiUrl}api/restaurants/${selectedRestaurant}`; // Adjusted to fetch rates for the selected restaurant
      const token = decryptToken(encryptedToken);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the rates from the restaurants API");
      }
      const data = await response.json();
      setMarkerCoordinatesfirst({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
      });
      // Assuming the API returns an array of objects and you need the first object's rates
      // This is the new line to set the rate above 6km
    } catch (error) {
      console.error("Error fetching rates:", error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchRates();
  }, [selectedRestaurant]);

  useEffect(() => {
    // Знайдіть об'єкт вибраного ресторану зі списку ресторанів
    const restaurant = restaurants.find(
      (r) => r.id.toString() === selectedRestaurant
    );

    if (restaurant && restaurant.lat && restaurant.lon) {
      // Оновіть markerCoordinates за допомогою координат вибраного ресторану
      setMarkerCoordinatesfirst({
        lat: parseFloat(restaurant.lat),
        lng: parseFloat(restaurant.lon),
      });
    }
  }, [selectedRestaurant, restaurants]);

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPayment_method(method);

    // If 'Gotówka' is selected, set 'Karta' to '0,00'
    if (method === "Gotówka") {
      setKarta("0,00");
      setGotuwka(amount.replace(" zł", "").replace(",", ".")); // This will set the 'Gotówka' field to the current amount
    }
    // If 'Karta' is selected, set 'Gotówka' to '0,00'
    else if (method === "Karta") {
      setGotuwka("0,00");
      setKarta(amount.replace(" zł", "").replace(",", ".")); // This will set the 'Karta' field to the current amount
    }
    // If any other payment method is selected, reset both 'Karta' and 'Gotówka'
    else {
      setKarta("0,00");
      setGotuwka("0,00");
    }
  };

  useEffect(() => {
    if (payment_method === "Gotówka") {
      setKarta("0,00");
      setGotuwka(amount.replace(" zł", "").replace(",", "."));
    } else if (payment_method === "Karta") {
      setGotuwka("0,00");
      setKarta(amount.replace(" zł", "").replace(",", "."));
    } else {
      setKarta("0,00");
      setGotuwka("0,00");
    }
  }, [payment_method, amount]);

  const updateRateAbove6km = () => {
    const km = parseFloat(kilometry) || 0;
    const additionalRate = parseFloat(rateAbove6km.replace(/,/, ".")) || 0;

    let newRateAbove6km = 0;

    if (km > 6) {
      newRateAbove6km = (km - 6) * additionalRate;
    }

    // Оновлюємо стан для розрахованої ставки, використовуючи крапку як десятковий роздільник
    setCalculatedRateAbove6km(newRateAbove6km.toFixed(2));
  };

  useEffect(() => {
    const formattedDistance = `${Number(distance)
      .toFixed(2)
      .replace(".", ",")}`;
    setKilometry(formattedDistance);
  }, [distance]);

  useEffect(() => {
    const fetchCouriers = async () => {
      const encryptedToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const token = decryptToken(encryptedToken);
      if (!token) return;

      try {
        const response = await axios.get(`${apiUrl}api/courierslist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCouriers(response.data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCouriers();
  }, [apiUrl]);

  const handleKilometryChange = (e) => {
    setKilometry(e.target.value.replace(",", "."));
  };

  useEffect(() => {
    if (orderDetails && orderDetails.order) {
      setSelectedOrder(orderDetails.order);
      setKarta(orderDetails.order.karta || "0,00");
      setGotuwka(orderDetails.order.gotuwka || "0,00");
      setphone_number(orderDetails.order.phone_number || "");
      setStatus(orderDetails.order.status || "");

      setStreet(orderDetails.order.street || "");
      setApartmentNumber(orderDetails.order.apartment_number || "");
      setCity(orderDetails.order.city || "Rzeszów");
      setAmount(orderDetails.order.amount || "0,00 zł");
      setDelivery_time(
        orderDetails.order.delivery_time || "Tak szybko, jak to możliwe"
      );
      sethouse_number(orderDetails.order.house_number || "");
      setOrder_size(orderDetails.order.order_size || "");
      setDescription(orderDetails.order.description || "");
      setRateUpTo6km(orderDetails.order.rateUpTo6km || "");
      setPayment_method(() => orderDetails.order.payment_method || "");
      setRateAbove6km(orderDetails.order.rateAbove6km || "");
      setDelivery_fee(orderDetails.order.delivery_fee || 0);
      setRateOutsideZone(orderDetails.order.rateOutsideZone || "");
      setCompletion_date(orderDetails.order.completion_date || "");
      setKilometry(orderDetails.order.kilometry || "");
      setKarta(orderDetails.order.karta || "");
      setGotuwka(orderDetails.order.gotuwka || "");
      setTermin_realizacji(orderDetails.order.termin_realizacji || "");
      setFormatted_created_at(orderDetails.order.formatted_created_at || "");
      setKuriers(orderDetails.order.kuriers || "");
      setSelectedRestaurant(orderDetails.order.restaurant_id.toString() || ""); // This is the updated line
      updateMapCoordinates(
        orderDetails.order.street,
        orderDetails.order.house_number
      );
    }
  }, [orderDetails]);

  useEffect(() => {}, [selectedOrder]);

  const shouldUpdateTime = (status) => {
    return [
      "Anulowane",
      "Reklamacja",
      "Nie Dostarczono",
      "Zrealizowane",
    ].includes(status);
  };

  useEffect(() => {
    const amountFloat = parseFloat(amount.replace(" zł", "").replace(",", "."));
    setIsAmountGreaterThanZero(amountFloat > 0);

    if (amountFloat > 0) {
      setPayment_method("Gotówka");
    } else if (amountFloat === 0) {
      setPayment_method("Zapłacono Online");
    }
  }, [amount]);

  useEffect(() => {
    if (isAmountGreaterThanZero) {
      if (payment_method === "Zapłacono Online") {
        setPayment_method("");
      }
      setIsCardCashDisabled(false);
    } else {
      setPayment_method("Zapłacono Online");
      setIsCardCashDisabled(true);
    }
  }, [isAmountGreaterThanZero]);

  const handleAmountChange = (e) => {
    const formattedValue = e.target.value.replace(/,/g, ".");
    const floatValue = parseFloat(formattedValue.replace(" zł", ""));
    setAmount(formattedValue);

    const newIsAmountGreaterThanZero = floatValue > 0;
    setIsAmountGreaterThanZero(newIsAmountGreaterThanZero);

    const isGreaterThanZero = floatValue > 0;
    setIsAmountGreaterThanZero(isGreaterThanZero);

    if (isGreaterThanZero) {
      setPayment_method("Gotówka");
    } else {
      setPayment_method("Zapłacono Online");
    }
  };

  const handleGotuwkaChange = (e) => {
    const gotuwkaValue = e.target.value.replace(/,/g, ".");
    setGotuwka(gotuwkaValue);

    if (payment_method === "Karta i Gotówka") {
      const gotuwkaFloat = parseFloat(gotuwkaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const kartaCalc = amountFloat - gotuwkaFloat;
      setKarta(kartaCalc.toFixed(2));
    } else if (payment_method === "Karta") {
      const gotuwkaFloat = parseFloat(gotuwkaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const kartaCalc = amountFloat - gotuwkaFloat;
      setKarta("0,00");
    } else if (payment_method === "Gotówka") {
      const gotuwkaFloat = parseFloat(gotuwkaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const kartaCalc = amountFloat - gotuwkaFloat;
      setKarta("0,00");
    }
  };

  const handleKartaChange = (e) => {
    const kartaValue = e.target.value.replace(/,/g, ".");
    setKarta(kartaValue);

    if (payment_method === "Karta i Gotówka") {
      const kartaFloat = parseFloat(kartaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const gotuwkaCalc = amountFloat - kartaFloat;
      setGotuwka(gotuwkaCalc.toFixed(2));
    } else if (payment_method === "Karta") {
      const kartaFloat = parseFloat(kartaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const gotuwkaCalc = amountFloat - kartaFloat;
      setGotuwka("0,00");
    } else if (payment_method === "Gotówka") {
      const kartaFloat = parseFloat(kartaValue) || 0;
      const amountFloat =
        parseFloat(amount.replace(" zł", "").replace(",", ".")) || 0;
      const gotuwkaCalc = amountFloat - kartaFloat;
      setGotuwka(gotuwkaCalc.toFixed(2));
    }
  };

  const getCurrentTimeInPoland = () => {
    const currentTime = new Date();
    const polandTime = currentTime.toLocaleString("en-GB", {
      timeZone: "Europe/Warsaw",
      hour12: false,
    });

    const [date, time] = polandTime.split(", ");
    const [day, month, year] = date.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    const formattedTime = `${formattedDate} ${time}`;
    return formattedTime;
  };
  useEffect(() => {
    if (payment_method === "Gotówka") {
      setKarta("0,00");
    } else if (payment_method === "Karta") {
      setGotuwka("0,00");
    }
  }, [payment_method]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (shouldUpdateTime(newStatus)) {
      const currentTime = getCurrentTimeInPoland();
      setCompletion_date(currentTime);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder || selectedOrder.order_number === undefined) {
      console.error(
        "Selected order is undefined or does not have an order_number."
      );
      alert("Nie można zaktualizować zamówienia bez numeru zamówienia.");
      return;
    }

    const amountFloat = parseFloat(amount.replace(" zł", "").replace(",", "."));

    if (payment_method === "Zapłacono Online" && amountFloat > 0) {
      alert("Nieprawidłowy sposób płatności dla kwoty większej niż 0 zł.");
      return;
    }

    const gotuwkaFloat = parseFloat(
      gotuwka.replace(" zł", "").replace(",", ".")
    );
    const kartaFloat = parseFloat(karta.replace(" zł", "").replace(",", "."));

    if (
      payment_method === "Karta i Gotówka" &&
      gotuwkaFloat + kartaFloat !== amountFloat
    ) {
      alert("Kwota w polach Karta i Gotówka musi być równa sumie Kwota.");
      return;
    }

    if (
      payment_method === "Gotówka" &&
      gotuwkaFloat + kartaFloat !== amountFloat
    ) {
      alert("Kwota w polach Gotówka musi być równa sumie Kwota.");
      return;
    }

    if (
      payment_method === "Karta" &&
      gotuwkaFloat + kartaFloat !== amountFloat
    ) {
      alert("Kwota w polach Karta musi być równa sumie Kwota.");
      return;
    }

    let updatedKuriers = kuriers;
    if (kuriers === null || kuriers === "") {
      updatedKuriers = "Karol Tomasz";
      setKuriers(updatedKuriers);
    }

    const orderData = {
      kilometry_poza_strefy: outsideDistance.toString(),
      kilometry,
      phone_number,
      rateOutsideZone,
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
      rateAbove6km,
      rateUpTo6km,
      pozastrefaorig: calculatedRateOutsideZone.toString(),
      karta,
      gotuwka,
      termin_realizacji,
      formatted_created_at,
      kuriers: updatedKuriers,
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
        setModalVisible(false);
        alert("Zamówienie zostało zaktualizowane.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Nie udało się zaktualizować zamówienia.");
    }
  };

  const calculateCompletionTime = (createdTime, completionTime) => {
    const createdDate = new Date(createdTime);
    const completionDate = new Date(completionTime);

    const difference = completionDate - createdDate;

    let hours = Math.floor(difference / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (payment_method === "Zapłacono Online") {
      setKarta("0,00");
      setGotuwka("0,00");
    }

    switch (payment_method) {
      case "Gotówka":
        setIsKartaDisabled(true);
        setIsGotuwkaDisabled(false);
        break;
      case "Karta":
        setIsKartaDisabled(false);
        setIsGotuwkaDisabled(true);
        break;
      case "Karta i Gotówka":
        setIsKartaDisabled(false);
        setIsGotuwkaDisabled(false);
        break;
      case "Zapłacono Online":
        setIsKartaDisabled(true);
        setIsGotuwkaDisabled(true);
        break;
      default:
        setIsKartaDisabled(false);
        setIsGotuwkaDisabled(false);
        break;
    }
  }, [payment_method]);

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
      setTermin_realizacji(completionTime);
    }
  }, [selectedOrder]);

  const calculateRateOutsideZone = () => {
    return Math.ceil(outsideDistance) * Number(rateOutsideZone);
  };

  useEffect(() => {
    const calculateRateOutsideZone = () => {
      const rate = Math.ceil(outsideDistance) * Number(rateOutsideZone);
      return rate;
    };

    const calculatedRate = calculateRateOutsideZone();
    setCalculatedRateOutsideZone(calculatedRate);

    setPozastrefaorig(calculatedRate.toString());
  }, [outsideDistance, rateOutsideZone]);

  useEffect(() => {
    const rateOutsideNum = calculateRateOutsideZone();
    const rateUpTo6kmNum = Number(
      rateUpTo6km.replace(" zł", "").replace(",", ".")
    );
    const rateAbove6kmNum = Number(
      calculatedRateAbove6km.replace(" zł", "").replace(",", ".")
    );

    const totalDeliveryFee = rateOutsideNum + rateUpTo6kmNum + rateAbove6kmNum;
    setDelivery_fee(totalDeliveryFee.toFixed(2));
  }, [rateOutsideZone, rateUpTo6km, calculatedRateAbove6km, outsideDistance]);

  useEffect(() => {
    if (status === "Anulowane" || status === "Reklamacja") {
      setRateUpTo6km("0");
      setCalculatedRateAbove6km("0");
      setRateOutsideZone("0");
    } else {
      const rateUpTo6km = orderDetails?.order?.rateUpTo6km ?? "0";
      const rateOutsideZone = orderDetails?.order?.rateOutsideZone ?? "0";

      setRateUpTo6km(rateUpTo6km);

      setCalculatedRateAbove6km("0");
      setRateOutsideZone(rateOutsideZone);
    }
  }, [status, orderDetails]);

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
              <label style={{ zIndex: "2" }}>Ulica</label>
              <StreetSelector
                city={city}
                selectedStreet={street}
                onSelectStreet={(selectedStreet) => {
                  setStreet(selectedStreet);
                  updateMapCoordinates(selectedStreet); // Оновлюємо координати на карті
                }}
              />
            </div>

            <div className="input-group">
              <label>Nr Mieszkania</label>
              <input
                type="text"
                value={apartment_number}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="Podaj numer mieszkania"
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
              <select
                value={payment_method}
                onChange={handlePaymentMethodChange}
              >
                {isAmountGreaterThanZero ? (
                  <>
                    <option value="Gotówka">Gotówka</option>
                    <option value="Karta">Karta</option>
                    <option value="Karta i Gotówka">Karta i Gotówka</option>
                  </>
                ) : (
                  <>
                    <option value="Zapłacono Online">Zapłacono Online</option>
                  </>
                )}
              </select>
            </div>
            <div className="input-group">
              <label>Opłata za dostawę</label>
              <input
                type="text"
                value={delivery_fee}
                placeholder="Opłata za dostawę"
                readOnly
                disabled
              />
            </div>
            <div className="input-group">
              <label>Godzina realizacji zamówienia</label>
              <input
                type="text"
                value={completion_date}
                onChange={(e) => setCompletion_date(e.target.value)}
                placeholder="Godzina realizacji zamówienia"
                readOnly
                disabled
              />
            </div>

            <div className="input-group">
              <label>Karta</label>
              <input
                type="text"
                value={karta}
                onChange={handleKartaChange}
                placeholder="Szczegóły karty"
                disabled={isKartaDisabled}
              />
            </div>
            <div className="input-group">
              <label>Status Zamówienia</label>
              <select value={status} onChange={handleStatusChange}>
                <option value="Oczekujących">Oczekujących</option>
                <option value="Zrealizowane">Zrealizowane</option>
                <option value="Czekamy na potwierdzenie">W Realizacji</option>
                <option value="Anulowane">Anulowane</option>
                <option value="Reklamacja">Reklamacja</option>
                <option value="Nie Dostarczono">Nie Dostarczono</option>
              </select>
            </div>

            <div className="input-group">
              <label>Wybierz Kuriera</label>
              <select
                value={kuriers}
                onChange={(e) => setKuriers(e.target.value)}
              >
                {couriers.map((courier, index) => (
                  <option
                    key={index}
                    value={`${courier.first_name} ${courier.last_name}`}
                  >
                    {courier.first_name} {courier.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-column">
            {/* Right column inputs */}

            <div className="input-group">
              <label style={{ zIndex: "2" }}>Miejscowość</label>
              <CitySelector selectedCity={city} onSelectCity={setCity} />
            </div>
            <div className="input-group">
              <label style={{ zIndex: "1" }}>Nr Budynku</label>
              <NumerBudynku
                key={`${city}-${street}`}
                city={city}
                value={house_number}
                street={street}
                house_number={house_number}
                onSelecthouse_number={(selectedhouse_number) => {
                  sethouse_number(selectedhouse_number || "");
                  updateMapCoordinates(street, selectedhouse_number || "");
                }}
              />
            </div>

            <div className="input-group">
              <label>Kwota</label>
              <input type="text" value={amount} onChange={handleAmountChange} />
            </div>

            <div className="input-group">
              <label>Wielkość Zamówienia</label>
              <select
                value={order_size}
                onChange={(e) => setOrder_size(e.target.value)}
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
              <label>Stawka do 6 km</label>
              <input
                type="text"
                value={rateUpTo6km}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, "");
                  const formattedValue = value.replace(/,/g, ".");
                  setRateUpTo6km(formattedValue);
                }}
                placeholder="Podaj stawkę do 6 km"
              />
            </div>
            <div className="input-group">
              <label>Stawka powyżej 6 km</label>
              <input
                type="text"
                value={calculatedRateAbove6km}
                placeholder="Podaj stawkę powyżej 6 km"
                disabled
              />
            </div>
            <div className="input-group">
              <label>Stawka poza strefą</label>
              <input
                type="text"
                disabled
                value={calculateRateOutsideZone()}
                onChange={(e) => setRateOutsideZone(e.target.value)}
                placeholder="Podaj stawkę poza strefą"
              />
            </div>

            <div className="input-group">
              <label>Kilometry</label>
              <input
                type="text"
                value={`${Number(distance).toFixed(2).replace(".", ",")} km`}
                onChange={handleKilometryChange}
                placeholder="Wpisz ulice i wybierz restaurację, aby obliczyć kilometry"
                disabled
              />
            </div>

            <div className="input-group">
              <label>Gotówka</label>
              <input
                type="text"
                value={gotuwka}
                onChange={handleGotuwkaChange}
                placeholder="Szczegóły gotówki"
                disabled={isGotuwkaDisabled}
              />
            </div>

            <div className="input-group">
              <label>Czas Realizacji Zamówienia</label>
              <input
                type="text"
                disabled
                value={termin_realizacji}
                onChange={(e) => setTermin_realizacji(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div className="modal-body-1">
          <div className="input-group-3">
            <label>Droga Zamówienia na Mapie</label>
          </div>
          {selectedRestaurant && (
            <MapBoxComponentRoute
              setDistance={setDistance}
              setOutsideDistance={handleSetOutsideDistance}
              coordinates={markerCoordinatesfirst}
              rzeszowCoordinates={markerCoordinatesfirst}
              secondCoordinates={secondMarkerPosition}
              restaurantName={selectedRestaurant}
              onMarkerDragEnd={onMarkerDragEnd}
              restaurantId={selectedRestaurant}
              street={street}
              city={city}
              house_number={house_number}
            />
          )}
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
