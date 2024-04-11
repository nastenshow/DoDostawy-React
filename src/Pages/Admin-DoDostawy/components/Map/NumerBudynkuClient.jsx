import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const NumerBudynku = ({ city, street, onSelecthouse_number, house_number  }) => {
  const [house_numbers, sethouse_numbers] = useState([]);
  const [selectedhouse_number, setSelectedhouse_number] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Додано новий стан для введення
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
    setInputValue(house_number || ''); // Set inputValue based on house_number prop
  }, [house_number]);

  useEffect(() => {
    if (house_number) {
      setSelectedhouse_number({ label: house_number, value: house_number });
    }
  }, [house_number]);
  useEffect(() => {
    const fetchhouse_numbers = async () => {
      if (city && street && (inputValue || house_number)) {
        setLoading(true);
        const token = decryptToken(encryptedToken);
        // Consider using either inputValue or house_number for the query
        const queryValue = inputValue || house_number; // Use inputValue if available, else fall back to house_number
        const url = `${apiUrl}api/house-numbers?street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&house_number=${encodeURIComponent(queryValue)}`;
        console.log(url);
        try {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (response.data.status === 'found') {
            const house_numbersOptions = response.data.data.map(item => ({
              label: item.house_number,
              value: item.house_number
            }));
            sethouse_numbers(house_numbersOptions);
          } else if (response.data.status === 'created') {
            // Handle newly created house number
            const newHouseOption = {
              label: response.data.data.house_number,
              value: response.data.data.house_number
            };
            sethouse_numbers([newHouseOption]);
            setSelectedhouse_number(newHouseOption);
          } else {
            sethouse_numbers([]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchhouse_numbers();
  }, [city, street, inputValue, house_number]); // Додано inputValue у залежності useEffect

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    return newValue;
  };







  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: '100%',
      color: '#364A63',
      fontFamily: "'Inter', sans-serif",
      padding: '7px',
      fontWeight: '700',
      border: state.isFocused ? '1px solid blue' : '1px solid #E4E4E4',
      borderRadius: '9px',
      fontSize: '16px',

    }),
  };

  return (
    <Select
      styles={customStyles}
      options={house_numbers}
      value={selectedhouse_number}
      onInputChange={handleInputChange} // Обробник зміни тексту в полі введення
      onChange={(option) => {
        setSelectedhouse_number(option);
        onSelecthouse_number(option ? option.value : '');
      }}
      isLoading={loading}
      placeholder="Wybierz numer budynku..."
      isClearable
      noOptionsMessage={() => "Brak numerów budynków"}
    />
  );
};

export default NumerBudynku;
