import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import translations from './translations';
import CryptoJS from "crypto-js";
import { getRequestToken, getAccessToken, getOAuthHeader } from './OAuthUtils';

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const CitySelector = ({ selectedCity, onSelectCity }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  function translateCityName(cityName) {
    return cityName.split(' ').map(word => translations[word] || word).join(' ');
  }

  const encryptedToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const decryptToken = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  

  useEffect(() => {
    if (inputValue.length > 2) {
      const timeoutId = setTimeout(() => {
        setLoading(true);
        const token = decryptToken(encryptedToken);
  
        axios.get(`${apiUrl}api/check-city?city=${encodeURIComponent(inputValue)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          setLoading(false);
          if (response.data.exists) {
            // Only update options if they are different to prevent unnecessary renders
            setOptions([{ value: response.data.city, label: translateCityName(response.data.city) }]);
          } else {
            // If the city doesn't exist, and it's different from the current state, update it
            setOptions(currentOptions => currentOptions.length ? [] : currentOptions);
          }
        })
        .catch(error => {
          console.error("Error checking city existence:", error);
          setLoading(false);
        });
      }, 500);
  
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // If inputValue is too short and options is not empty, clear it
      setOptions(currentOptions => currentOptions.length ? [] : currentOptions);
    }
    // Removing decryptToken and encryptedToken from the dependencies array to prevent infinite loop
  }, [inputValue, apiUrl]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      // тут ваші кастомізовані стилі
      width: '100%',
    color: '#364A63',
    fontFamily: "'Inter', sans-serif",
    padding: '7px',
    fontWeight: '700',
    border: state.isFocused ? '1px solid blue' : '1px solid #E4E4E4', // приклад виділення при фокусі
    borderRadius: '9px',
    fontSize: '16px',


    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 2, // Задаємо z-index для меню
    }),
    // Якщо потрібно специфічно для menuList
    menuList: (provided) => ({
      ...provided,
      zIndex: 2, // Задаємо z-index для списку опцій у меню
    }),

  };

  return (
    <Select
      styles={customStyles}
      value={options.find(option => option.value === selectedCity)}
      onInputChange={handleInputChange}
      onChange={(option) => onSelectCity(option ? option.value : null)}
      options={options}
      placeholder={selectedCity || "Szukaj miasta..."}
      isLoading={loading}
      isClearable
      noOptionsMessage={() => "Brak miasta"}
    />
  );
};

export default CitySelector;