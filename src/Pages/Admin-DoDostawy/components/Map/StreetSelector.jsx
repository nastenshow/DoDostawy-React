import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const StreetSelector = ({ city, selectedStreet, onSelectStreet }) => {
  const [streets, setStreets] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const isCustomStreet = (streetValue) => streets.some(street => street.value === streetValue && street.isCustom);

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
      setLoading(true);
      

      const timeoutId = setTimeout(() => {
        const token = decryptToken(encryptedToken);
        const url = `${apiUrl}api/search-streets?query=${encodeURIComponent(
          inputValue
        )}&city=${encodeURIComponent(city)}`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            
            setStreets(response.data.length ? response.data : [{ value: inputValue, label: inputValue, isCustom: true }]);
            setLoading(false);
          })
          .catch((error) => {
  
            setLoading(false);
          });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [city, inputValue]);

  const handleInputChange = (newValue) => {
  
    setInputValue(newValue);
    return newValue;
  };


  const handleSelectStreet = async (option) => {
    if (option?.isCustom) {

      // Тут можна викликати API для створення нової вулиці в базі даних
      try {
        const token = decryptToken(encryptedToken);
        const response = await axios.post(`${apiUrl}api/add-street`, {
          name: option.value,
          city: city,
          lat: 50.04132,
          lon: 21.99901,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     
        // Оновіть список вулиць, якщо потрібно
      } catch (error) {
      
      }
    } else {
      onSelectStreet(option ? option.value : null);
    }
  };

  useEffect(() => {
    // Assuming you have logic to handle a new street selection
    if (selectedStreet) {
      // Perform any action needed when a new street is selected
    }
  }, [selectedStreet]);

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


  const getSelectedStreetValue = () => {
    const selectedOption = streets.find((option) => option.value === selectedStreet);
    if (selectedOption && selectedOption.isCustom) {
      return { ...selectedOption, label: `N: ${selectedOption.label}` };
    }
    return selectedOption;
  };

  return (
    <Select
    styles={customStyles}
    options={streets.map(option => option.isCustom ? { ...option, label: `N: ${option.label}` } : option)} // Додавання "Nowa:" до мітки для вигаданих вулиць у випадаючому списку
    value={getSelectedStreetValue()} // Встановлення вибраного значення з можливим префіксом "Nowa:"
    onInputChange={handleInputChange}
    onChange={handleSelectStreet}
    isLoading={loading}
    placeholder={selectedStreet || "Wybierz ulicę..."}
    isClearable
    noOptionsMessage={() => inputValue ? `N: ${inputValue}` : "Brak ulic"}
  />
  );
};

export default StreetSelector;