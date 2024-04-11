// AdditionalRateLogic.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CryptoJS from "crypto-js";

const apiUrl = import.meta.env.VITE_LINK;
const secretKey = import.meta.env.VITE_SECRET_KEY;

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

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const AdditionalRateLogic = ({ restaurantId }) => {
  // Додавання стану для збереження індексу

  const [additionalRatesLogic, setAdditionalRatesLogic] = useState([]);
  const [pendingRate, setPendingRate] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const handleAddAdditionalRateLogic = () => {
    // Перевіряємо, чи є незбережені зміни або пустий запис у списку
    const hasPendingRate = pendingRate || additionalRatesLogic.some(rate => rate.ilosc_zlecen === "" || rate.stawka_do_6_km === "" || rate.stawka_ponad_6_km === "" || rate.stawka_poza_strefa === "");

    if (!hasPendingRate) {
      // Прямо додаємо новий елемент в кінець масиву, без створення змінної newRates
      setAdditionalRatesLogic(additionalRatesLogic.concat({
        id: null,
        ilosc_zlecen: "",
        stawka_do_6_km: "",
        stawka_ponad_6_km: "",
        stawka_poza_strefa: "",
      }));

        // Сортування за ilosc_zlecen
        newRates.sort((a, b) => {
          const iloscA = parseInt(a.ilosc_zlecen, 10) || 0; // Перетворюємо в число, використовуючи parseInt
          const iloscB = parseInt(b.ilosc_zlecen, 10) || 0;
          console.log(a.ilosc_zlecen) 
          console.log(a.ilosc_zlecen)// Якщо перетворення неможливе, використовуємо 0
          return iloscA - iloscB;
        });

        

        

        setAdditionalRatesLogic(newRates);
        // Оновлюємо pendingRate з новим пустим записом, який потребує заповнення
        setPendingRate({
            ilosc_zlecen: "",
            stawka_do_6_km: "",
            stawka_ponad_6_km: "",
            stawka_poza_strefa: "",
        });
    } else {
        // Вивести повідомлення або зробити кнопку неактивною
        alert("Zakończ dodawanie lub edycję bieżącego rekordu przed utworzeniem nowego.");
    }
};

  const handleRemoveAdditionalRateLogic = () => {
    setAdditionalRatesLogic((logic) => logic.slice(0, -1));
  };

  const handleSubmitSingleRate = async (rate) => {
    if (
      !rate.ilosc_zlecen ||
      !rate.stawka_do_6_km ||
      !rate.stawka_ponad_6_km ||
      !rate.stawka_poza_strefa
    ) {
     
      return;
    }

    const decryptedToken = decryptToken();
    if (!decryptedToken) {
      console.error("Token decryption failed");
      return;
    }

    const isExistingRate = rate.id !== null;

    const endpoint = isExistingRate
      ? `${apiUrl}api/rates/${rate.id}`
      : `${apiUrl}api/rates`;
    const method = isExistingRate ? "PUT" : "POST";

    try {
      const response = await axios({
        method: method,
        url: endpoint,
        data: {
          restaurant_id: restaurantId,
          ilosc_zlecen: rate.ilosc_zlecen,
          stawka_ponad_6_km: rate.stawka_do_6_km,
          stawka_do_6_km: rate.stawka_ponad_6_km,
          stawka_poza_strefa: rate.stawka_poza_strefa,
        },
        headers: { Authorization: `Bearer ${decryptedToken}` },
      });
     
      if (!isExistingRate && response.data.id) {
        const updatedLogic = [...additionalRatesLogic];
        updatedLogic[index].id = response.data.id;
        setAdditionalRatesLogic(updatedLogic);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateNewRate = async (rate) => {
    if (!rate.ilosc_zlecen || !rate.stawka_do_6_km || !rate.stawka_poza_strefa) {
      alert("Wszystkie pola muszą być wypełnione.");
      return;
    }
  
    // Перевірка на унікальність ilosc_zlecen
    const isIloscZlecenUnique = !additionalRatesLogic.some((existingRate) => 
      existingRate.ilosc_zlecen === rate.ilosc_zlecen && existingRate.id !== rate.id);
  
    if (!isIloscZlecenUnique) {
      alert("Stawka dla podanej ilości zleceń już istnieje.");
      return;
    }
  
    const decryptedToken = decryptToken();
    if (!decryptedToken) {
      console.error("Token decryption failed");
      return;
    }
  
    try {
      const response = await axios({
        method: "POST",
        url: `${apiUrl}api/rates`,
        data: {
          restaurant_id: restaurantId,
          ilosc_zlecen: rate.ilosc_zlecen,
          stawka_do_6_km: rate.stawka_do_6_km,
          stawka_poza_strefa: rate.stawka_poza_strefa,
          // Якщо потрібно змінити логіку для stawka_ponad_6_km, оновіть тут
          stawka_ponad_6_km: "0.00",
        },
        headers: { Authorization: `Bearer ${decryptedToken}` },
      });
  
      if (response.data.id) {
        setUpdateTrigger((trigger) => !trigger); // Викликаємо перезавантаження даних
        setPendingRate(null); // Очищуємо форму для нової ставки
      }
    } catch (error) {
      console.error("Error creating new rate:", error);
    }
  };

  const handleInputChange = debounce((index, name, value) => {
    const updatedLogic = [...additionalRatesLogic];
    const formattedValue = value.replace(/,/g, '.');

    updatedLogic[index][name] = formattedValue;

    // Перевіряємо, чи всі поля заповнені перед додаванням нового запису
    const rate = updatedLogic[index];
  if (
    rate.id === null &&
    rate.ilosc_zlecen &&
    rate.stawka_do_6_km &&
    rate.stawka_poza_strefa
  ) {
    setPendingRate(rate);
  } else if (rate.id !== null) {
    handleSubmitSingleRate(rate);
  }
  setAdditionalRatesLogic(updatedLogic);
});

  const handleRemoveLastRate = async () => {
    const lastRateIndex = additionalRatesLogic.length - 1;
    const lastRate = additionalRatesLogic[lastRateIndex];

    // Перевіряємо, чи у останньої ставки є ID (тобто вона існує в базі даних)
    if (lastRate?.id) {
      const decryptedToken = decryptToken();
      if (!decryptedToken) {
        console.error("Token decryption failed");
        return;
      }

      try {
        await axios({
          method: "DELETE",
          url: `${apiUrl}api/rates/${lastRate.id}`,
          headers: { Authorization: `Bearer ${decryptedToken}` },
        });

        // Оновлення стану для видалення останньої ставки з UI
        const updatedRates = additionalRatesLogic.slice(0, -1);
        setAdditionalRatesLogic(updatedRates);
        
      } catch (error) {
        console.error("Error deleting rate:", error);
      }
    } else {
      // Якщо остання ставка не має ID, просто видаляємо її з UI
      const updatedRates = additionalRatesLogic.slice(0, -1);
      setAdditionalRatesLogic(updatedRates);
    }
  };

  useEffect(() => {
    // Оновлення для useEffect залишаються аналогічними
  }, [additionalRatesLogic]);

  const fetchRates = async () => {
    const decryptedToken = decryptToken();
    if (!decryptedToken) {
      console.error("Token decryption failed");
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}api/rates/${restaurantId}`, {
        headers: { Authorization: `Bearer ${decryptedToken}` },
      });
      // Переконуємося, що response.data є масивом перед оновленням стану
      if (Array.isArray(response.data)) {
        const sortedData = response.data.sort((a, b) => {
          const iloscA = parseInt(a.ilosc_zlecen, 10) || 0;
          const iloscB = parseInt(b.ilosc_zlecen, 10) || 0;
          return iloscA - iloscB;
        });
  
        setAdditionalRatesLogic(sortedData);
      } else {
        console.error("Expected an array, but received:", response.data);
        setAdditionalRatesLogic([]); // Встановлюємо пустий масив, якщо отримані дані не є масивом
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  useEffect(() => {
    fetchRates();
}, [restaurantId, updateTrigger]); // Додаємо restaurantId як залежність, щоб перезавантажити дані при зміні ID

  return (
    <>
      {additionalRatesLogic.map((logic, index) => (
        <div key={index} className="modal-body">
          <div className="modal-column">
            <div className="input-group">
              <label>Do ilu Zleceń</label>
              <input
                type="text"
                value={logic.ilosc_zlecen}
                onChange={(e) =>
                  handleInputChange(index, "ilosc_zlecen", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>Stawka ponad 6 km</label>
              <input
                type="text"
                value="0.00"
                disabled
                onChange={(e) =>
                  handleInputChange(index, "stawka_ponad_6_km", e.target.value)
                }
              />
            </div>
          </div>
          <div className="modal-column">
            <div className="input-group">
              <label>Stawka do 6 km</label>
              <input
                type="text"
                value={logic.stawka_do_6_km || ""}
                onChange={(e) =>
                  handleInputChange(index, "stawka_do_6_km", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>Stawka poza strefą</label>
              <input
                type="text"
                value={logic.stawka_poza_strefa || ""}
                onChange={(e) =>
                  handleInputChange(index, "stawka_poza_strefa", e.target.value)
                }
                pattern="[+,-,0-9,.zł\s]+"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="buttons-container">
        <button className="plus" onClick={handleAddAdditionalRateLogic}>
          <FontAwesomeIcon style={{ color: "white" }} icon={faPlus} />
        </button>
        
        <button className="minus" onClick={handleRemoveLastRate}>
          <FontAwesomeIcon style={{ color: "white" }} icon={faMinus} />
        </button>
        {pendingRate && (
          <button className="potwirdzices" onClick={() => handleCreateNewRate(pendingRate)}>
            Potwierdź Dodanie
          </button>
        )}
      </div>
    </>
  );
};

export default AdditionalRateLogic;
