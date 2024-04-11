import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../assets/Footer.css';



function ModalPolityka({ isModalVisible1, setModalVisible1 }) {
  if (!isModalVisible1) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ marginBottom: "-20px" }}>
          <h1>Polityka Prywatności - DoDostawy</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible1(false)}
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

          <h2>Informacje które zbieramy:</h2>
          <ul>
            <li>
              <strong>Informacje o koncie:</strong> Kiedy tworzysz konto na
              naszej Platformie, zbieramy informacje takie jak Twoje imię i
              nazwisko, adres e-mail, numer telefonu i hasło.
            </li>
            <li>
              <strong>Informacje o zleceniodawcach:</strong> współpracujące z
              nami firmy mogą udostępniać informacje o swojej działalności, w
              tym nazwę, lokalizację, pozycje menu i szczegóły zamówienia.
            </li>
            <li>
              <strong>Informacje o zamówieniu:</strong> Kiedy składasz
              zamówienie za pośrednictwem naszej platformy, zbieramy szczegółowe
              informacje o Twoim zamówieniu, takie jak zamówione produkty, adres
              wysyłki i informacje o płatności, itp.
            </li>
            <li>
              <strong>Informacje lokalne:</strong> Za Twoją zgodą, możemy
              zbierać dane o lokalizacji Twojego urządzenia, aby zapewnić Ci
              dokładne usługi dostawy.
            </li>
            <li>
              <strong>Informacje o użytkowaniu:</strong> Zbieramy informacje o
              Twoich interakcjach z naszą Platformą, w tym o przeglądanych
              stronach, używanych funkcjach oraz informacje techniczne o Twoim
              urządzeniu i połączeniu internetowym.
            </li>
            <li>
              <strong>Komunikacja:</strong> Możemy zbierać informacje, które
              podajesz podczas komunikacji z nami, takie jak zapytania dotyczące
              obsługi klienta lub opinie.
            </li>
          </ul>

          <h2>Jak wykorzystujemy Twoje dane:</h2>
          <ul>
            <li>
              <strong>Świadczenie usług:</strong> Wykorzystujemy Twoje dane, aby
              zapewnić Ci dostęp do naszych usług dostawy, przetworzyć Twoje
              zamówienie i komunikować się z Tobą.
            </li>
            <li>
              <strong>Ulepszaj nasze usługi:</strong> analizujemy wzorce
              użytkowania, aby ulepszyć nasze usługi, opracować nowe funkcje i
              poprawić komfort użytkowania.
            </li>
            <li>
              <strong>Obsługa klienta:</strong> Wykorzystujemy Twoje dane, aby
              odpowiadać na Twoje zapytania i zapewniać obsługę klienta.
            </li>
            <li>
              <strong> Marketing:</strong> Za Twoją zgodą możemy wysyłać Ci
              komunikaty promocyjne, w tym oferty, aktualizacje i istotne
              informacje naszych klientach.
            </li>
            <li>
              <strong>Zgodność z prawem:</strong> Możemy wykorzystywać Twoje
              dane w celu zapewnienia zgodności z obowiązującymi przepisami i
              regulacjami.
            </li>
          </ul>

          <h2>Wymiana informacji:</h2>
          <ul>
            <li>
              <strong>Zleceniodawcy:</strong> Przetwarzamy szczegóły Twojego
              zamówienia, aby je zrealizować.
            </li>
            <li>
              <strong>Partnerzy dostawczy:</strong> Udostępniamy adres dostawy i
              szczegóły zamówienia naszym partnerom dostawczym, aby ułatwić
              proces dostawy.
            </li>
            <li>
              <strong>Dostawcy usług:</strong> Możemy udostępniać Twoje dane
              zewnętrznym usługodawcom, którzy pomagają nam w świadczeniu
              naszych usług.
            </li>
            <li>
              <strong> Wymogi prawne:</strong> Możemy ujawnić Twoje dane, jeśli
              jest to wymagane przez prawo, w odpowiedzi na wnioski prawne lub w
              celu ochrony naszych praw, prywatności, bezpieczeństwa lub
              własności.
            </li>
            <li>
              <strong>Przeniesienie działalności:</strong> W przypadku fuzji,
              sprzedaży lub przeniesienia całości lub części naszych aktywów,
              Twoje dane mogą zostać przekazane w ramach transakcji.
            </li>
          </ul>

          <h2>Twój wybór</h2>
          <ul>
            <li>
              <strong>Ustawienia konta:</strong> Możesz zaktualizować informacje
              i ustawienia swojego konta, kontaktując się z naszym wsparciem.
            </li>
            <li>
              <strong>Preferencje dotyczące komunikacji:</strong> Możesz
              zarządzać swoimi preferencjami dotyczącymi komunikacji, postępując
              zgodnie z instrukcjami zawartymi w naszych e-mailach lub
              kontaktując się z nami.
            </li>
          </ul>

          <h2>Prywatność i bezpieczeństwo danych</h2>
          <ul>
            <li>
              <strong>
                Poważnie podchodzimy do prywatności i bezpieczeństwa danych.
              </strong>{" "}
              Podjęliśmy działania mające na celu zapewnienie poufności i
              bezpieczeństwa informacji o zamówieniach, a dostęp do tych danych
              ograniczamy do upoważnionych pracowników naszej firmy.
            </li>
            <li>
              <strong>Informacje o zamówieniach zleceniodawcy</strong> nie są
              udostępniane innym zleceniodawcą ani stronom trzecim, z wyjątkiem
              sytuacji, gdy jest to konieczne do realizacji zamówienia lub w
              inny sposób określony w niniejszej Polityce prywatności.
            </li>
          </ul>

          <h2>Prywatność dzieci:</h2>
          <ul>
            <li>
              Nasza platforma nie jest przeznaczona dla dzieci poniżej 13 roku
              życia. Nie gromadzimy ani nie przechowujemy świadomie informacji
              od osób poniżej tego wieku.
            </li>
          </ul>

          <h2>Zmiany w niniejszej Polityce Prywatności:</h2>
          <ul>
            <li>
              Od czasu do czasu możemy aktualizować niniejszą Politykę
              prywatności, aby odzwierciedlić zmiany w naszych praktykach.
              Zaktualizowana wersja zostanie opublikowana na naszej Platformie,
              a data ostatniej aktualizacji zostanie odpowiednio zmieniona.
            </li>
          </ul>

          <h2>Usługi stron trzecich:</h2>
          <ul>
            <li>
              Nasza Platforma może integrować się z usługami lub narzędziami
              stron trzecich, które pomagają zleceniodawcom zarządzać
              zamówieniami i zapasami. Korzystając z takich usług, zleceniodawcy
              podlegają warunkom i polityce prywatności tych stron trzecich.
            </li>
            <li>
              Należy pamiętać, że profile zleceniodawców na naszej Platformie
              mają na celu ułatwienie partnerstwa pomiędzy Twoją a naszą firmą.
              Informacje o zamówieniach są przetwarzane w sposób bezpieczny i
              dostęp do tych danych mają wyłącznie upoważnieni pracownicy naszej
              firmy.
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

export default ModalPolityka;