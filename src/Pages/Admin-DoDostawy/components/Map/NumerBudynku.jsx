import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const NumerBudynku = ({ city, street, onSelecthouse_number }) => {
  const [house_numbers, sethouse_numbers] = useState([]);
  const [selectedhouse_number, setSelectedhouse_number] = useState(null);
  
  const [inputValue, setInputValue] = useState(''); 
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
    const fetchhouse_numbers = async () => {
      if (city && street && inputValue) {
        setLoading(true);
        const token = decryptToken(encryptedToken);
        const url = `${apiUrl}api/house-numbers?street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&house_number=${encodeURIComponent(inputValue)}`;
        try {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Якщо номери будинків знайдені
          if (response.data.status === 'found') {
            const house_numbersOptions = response.data.data.map(item => ({
              label: item.house_number,
              value: item.house_number,
              isCustom: false
            }));
  
            // Перевіряємо, чи введений номер вже існує серед знайдених номерів
            const existingOption = house_numbersOptions.find(option => option.value === inputValue);
            // Якщо такого номера немає, додаємо "вигаданий" номер будинку
            if (!existingOption) {
              house_numbersOptions.push({ label: `N: ${inputValue}`, value: inputValue, isCustom: true });
            }
  
            sethouse_numbers(house_numbersOptions);
          } else {
            // Якщо жодного номера не знайдено, додаємо лише "вигаданий" номер будинку
            sethouse_numbers([{ label: `N: ${inputValue}`, value: inputValue, isCustom: true }]);
          }
        } catch (error) {
          // Якщо сталася помилка і номери не були завантажені, додаємо "вигаданий" номер будинку
          sethouse_numbers([{ label: `N: ${inputValue}`, value: inputValue, isCustom: true }]);
          setLoading(false);
        }
        setLoading(false);
      }
    };
    fetchhouse_numbers();
  }, [city, street, inputValue]); // Додано inputValue у залежності useEffect

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    // Перевірка, чи вже існує опція з таким номером будинку
    const existingOption = house_numbers.find(option => option.value === newValue);
    if (!existingOption && newValue.trim() !== '') {
      // Якщо такої опції немає і введене значення не є пустим рядком, додайте її як "вигадану"
      const newOption = { label: `N: ${newValue}`, value: newValue, isCustom: true };
      sethouse_numbers(prevOptions => [...prevOptions, newOption]);
    }
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
  
  const handleSelecthouse_number = async (option) => {
    setSelectedhouse_number(option); // Встановлюємо вибраний номер будинку незалежно від типу опції
    const newValue = option ? option.value : null;
    
    if (option?.isCustom) {
      try {
        const token = decryptToken(encryptedToken);
        await axios.post(`${apiUrl}api/add-house-number`, {
          name: street,
          city: city,
          house_number: newValue,
          lat: 50.04132,
          lon: 21.99901,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
       
      }
    }
    // Повідомляємо зовнішній обробник про вибір
    onSelecthouse_number(newValue);
  };

   

  return (
    <Select
      styles={customStyles}
      options={house_numbers}      
      value={selectedhouse_number}
      onInputChange={handleInputChange}
      onChange={handleSelecthouse_number}
      isLoading={loading}
      placeholder="Wybierz numer budynku..."
      isClearable
      noOptionsMessage={() => inputValue ? `N: ${inputValue}` : "Brak numerów budynków"}
    />
  );
};

export default NumerBudynku;
