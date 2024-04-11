import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/Footer.css";

function ModalZasady({ isModalVisible2, setModalVisible2 }) {
  if (!isModalVisible2) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ marginBottom: "-20px" }}>
          <h1>Zasady i Warunki DoDostawa</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible2(false)}
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

          <h2>Korzystanie z naszej platformy:</h2>
          <ul>
            <li>
              <strong>Platforma ma za zadanie</strong> ułatwić dostawy ze
              współpracujących z nami klientami. Użytkownik może korzystać z
              Platformy w celu składania zamówień, śledzenia zamówień i
              interakcji z zamówieniami.
            </li>
            <li>
              <strong>Użytkownik wyraża zgodę</strong> na korzystanie z
              Platformy zgodnie ze wszystkimi obowiązującymi przepisami prawa i
              regulacjami.
            </li>
          </ul>

          <h2>Współpraca z zleceniodawcą:</h2>
          <ul>
            <li>
              <strong>Kiedy składasz zamówieniena Platformie</strong>,
              zamówienie jest przetwarzane i realizowane przez klienta.
            </li>
            <li>
              <strong>Przyjmujesz do wiadomości</strong>, że Platforma nie
              ponosi odpowiedzialności za przygotowanie zamówień, a klient
              ponosi wyłączną odpowiedzialność za jakość i bezpieczeństwo
              zamówienia.
            </li>
          </ul>

          <h2>Zamawianie i dostawa:</h2>
          <ul>
            <li>
              <strong>Kiedy składasz zamówienie na Platformie</strong>,
              otrzymujesz potwierdzenie zamówienia. Platforma ułatwi dostawę
              Twojego zamówienia.
            </li>
            <li>
              <strong>Podane czasy dostawy</strong> są przybliżone i mogą się
              różnić w zależności od czynników takich jak czas przygotowania
              zamówienia, natężenie ruchu i warunki pogodowe.
            </li>
            <li>
              <strong>Mogą obowiązywać opłaty za wysyłkę</strong> i minimalne
              wymagania dotyczące zamówienia. Zostaną one wyraźnie przekazane
              podczas procesu składania zamówienia. naszych usług.
            </li>
            <li>
              <strong> Nasza firma zachowuje dostęp</strong> do informacji o
              zamówieniach w celu świadczenia usług dostawy.
            </li>
          </ul>

          <h2>Utwórz konto:</h2>
          <ul>
            <li>
              <strong>Aby móc korzystać z niektórych funkcji Platformy</strong>,
              takich jak historia zamówień i programy lojalnościowe, konieczne
              może być utworzenie konta. Jesteś odpowiedzialny za zachowanie
              poufności danych uwierzytelniających Twoje konto.
            </li>
          </ul>

          <h2>Zapłata:</h2>
          <ul>
            <li>
              <strong>Zgadzasz się uiścić wszystkie opłaty</strong> związane z
              Twoimi zamówieniami, w tym opłaty za zlecenie, podatki i opłaty za
              wysyłkę. My też mamy taki obowiązek.
            </li>
            <li>
              <strong>Informacje dotyczące płatności</strong> są przetwarzane w
              sposób bezpieczny i nie przechowujemy szczegółów płatności.
            </li>
          </ul>

          <h2>Anulowanie i zwrot pieniędzy:</h2>
          <ul>
            <li>
              <strong>Możesz anulować zamówienie zanim zostanie</strong> ono
              zrealizowane przez naszą firmę. Zasady anulowania rezerwacji mogą
              się różnić w zależności od zleceniodawcy.
            </li>
            <li>
              <strong>W stosownych przypadkach zwroty</strong> środków będą
              przetwarzane zgodnie z naszą Polityką zwrotów.
            </li>
          </ul>

          <h2>Prywatność:</h2>
          <ul>
            <li>
              <strong>
                Korzystanie z Platformy podlega naszej Polityce prywatności
              </strong>{" "}
              która określa, w jaki sposób gromadzimy, wykorzystujemy i chronimy
              Twoje dane osobowe.
            </li>
          </ul>

          <h2>Własność intelektualna:</h2>
          <ul>
            <li>
              <strong>Cała zawartość</strong>, logo i znaki towarowe na
              Platformie są własnością naszej firmy lub jej licencjodawców. Nie
              możesz ich używać, powielać ani rozpowszechniać bez naszej zgody.
              Lub świętuj nas.
            </li>
          </ul>

          <h2>Testowanie platformy i problemy techniczne:</h2>
          <ul>
            <li>
              <strong>Należy pamiętać</strong>, że Platforma jest obecnie w
              fazie testów i rozwoju. W rezultacie mogą wystąpić problemy
              techniczne i awarie.
            </li>

            <li>
              <strong>Staramy się szybko rozwiązywać</strong> wszelkie problemy
              i gwarantować realizację każdego zamówienia. Jesteśmy bardzo
              wdzięczni za Twoją opinię i cierpliwość podczas tej fazy
              testowania.
            </li>
          </ul>

          <h2>Wyłączenie gwarancji:</h2>
          <ul>
            <li>
              <strong>Nie składamy żadnych oświadczeń</strong> ani zapewnień
              dotyczących jakości, bezpieczeństwa lub dokładności zamówienia,
              klienta lub usług dostaw świadczonych za pośrednictwem Platformy.
            </li>
          </ul>

          <h2>Ograniczenie odpowiedzialności:</h2>
          <ul>
            <li>
              <strong>W żadnym wypadku nasza firma</strong> nie będzie ponosić
              odpowiedzialności za jakiekolwiek bezpośrednie, pośrednie,
              przypadkowe, szczególne lub wtórne szkody powstałe w wyniku
              korzystania z Platformy.
            </li>
          </ul>

          <h2>Zmiany Regulaminu:</h2>
          <ul>
            <li>
              <strong>Od czasu do czasu możemy aktualizować</strong> niniejsze
              Warunki. Wszelkie zmiany zostaną opublikowane na Platformie, a
              data ostatniej aktualizacji zostanie odpowiednio skorygowana.
            </li>
          </ul>

          {/* ... Continue with the rest of the sections as structured above ... */}

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

export default ModalZasady;
