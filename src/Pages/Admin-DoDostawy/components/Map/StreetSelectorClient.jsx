import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const StreetSelector = ({ city, selectedStreet, onSelectStreet }) => {
  const [streets, setStreets] = useState([]);
  const [inputValue, setInputValue] = useState(selectedStreet);
  const [loading, setLoading] = useState(false);

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (city && inputValue.length > 0) {
      setLoading(true); // Почати завантаження

      // Запускаємо затримку, щоб зменшити кількість запитів при швидкому введенні
      const timeoutId = setTimeout(() => {
        const token = decryptToken(encryptedToken);
        const url = `${apiUrl}api/search-streets?query=${encodeURIComponent(
          inputValue
        )}&city=${encodeURIComponent(city)}`; // Складаємо URL

        // Перевірка вулиць у локальній базі даних через API
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          .then((response) => {
            setStreets(response.data); // Оновлюємо стан з отриманими вулицями
            setLoading(false); // Завершення завантаження
          })
          .catch((error) => {
         
            setLoading(false); // Завершення завантаження у разі помилки
          });
      }, 500);

      // Очищаємо таймер, якщо компонент буде демонтуватись або зміниться вхідне значення
      return () => clearTimeout(timeoutId);
    }
  }, [city, inputValue]); // Залежності useEffect

  const handleInputChange = (newValue) => {
    setInputValue(newValue); // Оновлюємо стан з новим введеним значенням
    return newValue;
  };

  const handleSelectStreet = (option) => {
    if (option?.isCustom) {
      // Логіка додавання вулиці в базу даних
   
      // Тут можна викликати API для створення нової вулиці в базі даних
    } else {
      onSelectStreet(option ? option.value : null);
    }
  };

  useEffect(() => {
    if (!selectedStreet) {
      onSelectStreet("Bez ulicy");
    }
  }, [selectedStreet, onSelectStreet]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      color: "#364A63",
      fontFamily: "'Inter', sans-serif",
      padding: "7px",
      fontWeight: "700",
      border: state.isFocused ? "1px solid blue" : "1px solid #E4E4E4",
      borderRadius: "9px",
      fontSize: "16px",
    }),
  };

  return (
    <Select
      styles={customStyles}
      options={streets}
      value={streets.find((option) => option.value === selectedStreet)}
      onInputChange={handleInputChange}
      onChange={handleSelectStreet}
      isLoading={loading}
      placeholder={selectedStreet || "Wybierz ulicę..."}
      isClearable
      noOptionsMessage={() => "Brak ulic"}
    />
  );
};

export default StreetSelector;
