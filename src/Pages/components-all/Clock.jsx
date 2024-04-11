import React, { useState, useEffect } from 'react';

const Clock = ({ onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Оновлення часу кожну секунду

    return () => {
      clearInterval(intervalId); // Прибрати інтервал при розмонтуванні компонента
    };
  }, []); // Зверніть увагу на пустий масив залежностей

  useEffect(() => {
    onTimeUpdate(currentTime);
  }, [currentTime, onTimeUpdate]);

  return null; // Повертаємо `null`, оскільки немає нічого для відображення
};

export default Clock;