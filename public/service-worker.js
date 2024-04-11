// Встановлення Service Worker
self.addEventListener('install', (event) => {
    // Тут можна кешувати ресурси, якщо потрібно
    console.log('Service Worker встановлено');
  });
  
  // Активація Service Worker
  self.addEventListener('activate', (event) => {
    console.log('Service Worker активовано');
    // Тут можна очистити старий кеш, якщо потрібно
  });
  
  // Прослуховування сповіщень
  self.addEventListener('push', (event) => {
    // Тут можна отримати дані сповіщення та показати їх
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        // Тут можна вказати інші параметри, як-от іконку, звук тощо
      })
    );
  });
  
  // Прослуховування подій кліку по сповіщенню
  sself.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    // Відтворення звуку, коли користувач клікає на сповіщення
    const playSound = () => {
      // Створення аудіо-контексту
      const audioContext = new AudioContext();
      // Завантаження звуку
      fetch('/notification.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          // Створення джерела звуку
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start(0); // Відтворення звуку негайно
        })
        .catch(error => console.error('Помилка при завантаженні звуку:', error));
    };
  
    // Відтворити звук, якщо це можливо
    if (event.action === 'play_sound') {
      playSound();
    }
  
    // Ваш код для обробки кліка по сповіщенню...
  });
  
  // Прослуховування подій активації клієнтів
  self.addEventListener('activate', (event) => {
    // Тут можна встановити клієнтів за замовчуванням
    event.waitUntil(clients.claim());
  });