import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/Footer.css";

function ModalCookie({ isModalVisible4, setModalVisible4 }) {
  if (!isModalVisible4) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ marginBottom: "-20px" }}>
          <h1>Polityka Cookie DoDostawy</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible4(false)}
            className="icon-mark"
            style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
          />
        </div>
        <div>
          <p>Ostatnia aktualizacja: 23.10.2023</p>
          <p>
            Witamy na platformie DoDostawa.pl. W Do Dostawa przywiązujemy dużą
            wagę do ochrony prywatności i bezpieczeństwa Twoich danych
            osobowych. Niniejsza Polityka prywatności opisuje nasze metody
            gromadzenia, wykorzystywania i udostępniania Twoich danych.
            Korzystając z naszej platformy wyrażasz zgodę na praktyki opisane w
            niniejszej Polityce Prywatności.
          </p>

          <h2>Czym są pliki cookie?</h2>
          <ul>
            <li>
              Pliki cookies to małe pliki tekstowe, które są zapisywane na Twoim
              urządzeniu, gdy odwiedzasz stronę internetową lub korzystasz z
              aplikacji mobilnej. Są szeroko stosowane w celu poprawy wydajności
              stron internetowych i aplikacji oraz poprawy komfortu korzystania
              z Internetu. Pliki cookies nie zawierają danych osobowych.
            </li>
          </ul>

          <h2>Jak używamy plików cookies</h2>
          <ul>
            <li>
              Podstawowe pliki cookie: Te pliki cookie są niezbędne do
              podstawowego działania Platformy. Umożliwiają poruszanie się po
              Platformie i korzystanie z jej głównych funkcji.
            </li>
            <li>
              Wydajne pliki cookie: Używamy tych plików cookie do analizy
              sposobu, w jaki odwiedzający korzystają z naszej platformy, co
              pomaga nam zrozumieć i poprawić jej działanie. Te pliki cookie
              zbierają anonimowe dane o sposobie interakcji użytkowników z
              Platformą, w tym o odwiedzanych stronach i wszelkich błędach.
            </li>
            <li>
              Funkcjonalne pliki cookie: te pliki cookie pozwalają Platformie
              zapamiętać Twoje wybory, takie jak preferencje językowe lub
              region, w którym się znajdujesz, zapewniając ulepszone i
              spersonalizowane funkcje.
            </li>
            <li>
              Pliki cookie stron trzecich: Możemy zezwalać zewnętrznym
              usługodawcom na umieszczanie plików cookie na Platformie do
              różnych celów, takich jak analizy, reklamy i integracja z mediami
              społecznościowymi. Te pliki cookie stron trzecich podlegają
              odpowiednim politykom prywatności tych dostawców.
            </li>
          </ul>

          <h2>Zarządzanie plikami cookies</h2>
          <ul>
            <li>
              Możesz kontrolować i zarządzać plikami cookies za pomocą ustawień
              swojej przeglądarki. Należy pamiętać, że zablokowanie lub
              wyłączenie niektórych plików cookie może wpłynąć na możliwość
              korzystania z niektórych funkcji Platformy.
            </li>
          </ul>

          <h2>Prywatność i bezpieczeństwo danych</h2>
          <ul>
            <li>
              Zależy nam na ochronie Twojej prywatności i zapewnieniu
              bezpieczeństwa Twoich danych osobowych. Aby dowiedzieć się więcej
              o tym, jak gromadzimy, wykorzystujemy i chronimy Twoje dane,
              zapoznaj się z naszą Polityką prywatności.
            </li>
          </ul>

          <h2>Testowanie platformy i kwestie techniczne</h2>
          <ul>
            <li>
              Należy pamiętać, że Platforma jest obecnie w fazie testów i
              rozwoju. Na tym etapie mogą wystąpić problemy techniczne i
              aktywnie pracujemy nad ich rozwiązaniem. Pomimo tych trudności
              nadal pracujemy nad realizacją Waszych zamówień i zapewnieniem
              najlepszej obsługi.
            </li>
          </ul>

          <h2>Skontaktuj się z nami:</h2>
          <p>
            Jeśli masz jakiekolwiek pytania lub wątpliwości dotyczące niniejszej
            Polityki prywatności lub przetwarzania przez nas danych, skontaktuj
            się z nami pod adresem ul. Tadeusza Boya-Żeleńskiego 23, pok.113,
            +48 578 571 498.
          </p>
          <p>
            Dziękujemy za wybranie DoDostawy.pl! Dokładamy wszelkich starań, aby
            chronić Twoją prywatność i zapewniać najlepszą jakość dostaw.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalCookie;
