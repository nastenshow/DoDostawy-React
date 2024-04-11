import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/Footer.css";

function ModalZwroty({ isModalVisible3, setModalVisible3 }) {
  if (!isModalVisible3) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header" style={{ marginBottom: "-20px" }}>
          <h1>Polityka Zwrotów DoDostawy</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setModalVisible3(false)}
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

          <h2>Zwroty i refundacje (dla klientów współpracujących z nami)</h2>
          <ul>
            <li>
              <strong>Dokładność zamówień:</strong> Dokładamy wszelkich starań,
              aby wszystkie zamówienia złożone za pośrednictwem naszej platformy
              były realizowane prawidłowo. Jeśli klient popełnił błąd podczas
              przygotowywania zamówienia lub jeśli dostarczono niewłaściwy
              produkt, będziemy współpracować z klientem, aby rozwiązać problem.
            </li>
            <li>
              <strong>Prawo do zwrotu pieniędzy:</strong> Zwroty środków są
              zwykle dokonywane w formie uznania konta Twojej firmy na naszej
              Platformie. Uprawnienie do zwrotu kosztów będzie ustalane
              indywidualnie dla każdego przypadku i według uznania klienta.
            </li>
          </ul>

          <h2>Kwestie techniczne</h2>
          <ul>
            <li>
              <strong> Należy pamiętać,</strong>, że Platforma jest obecnie w
              fazie testów i rozwoju. Mogą wystąpić problemy techniczne, nad
              którymi aktywnie pracujemy nad ich rozwiązaniem.
            </li>
            <li>
              <strong>Chociaż dokładamy wszelkich starań,</strong> aby zapewnić
              płynną realizację zamówienia, czasami problemy techniczne mogą
              mieć wpływ na proces zamówienia. Dziękujemy za zrozumienie na
              etapie testowania.
            </li>
          </ul>

          <h2>Obowiązki klienta</h2>
          <ul>
            <li>
              <strong>Klienci współpracujący z naszą platformą</strong>{" "}
              odpowiadają za dokładność i jakość dań, które przygotowują i
              dostarczają.
            </li>
            <li>
              <strong>
                Wszelkie spory lub wątpliwości dotyczące samego zamówienia
              </strong>
              , w tym jego, należy rozstrzygać bezpośrednio z klientem, która
              przygotowała i dostarczyła zamówienie.
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

          <h2>Zmiany Polityki</h2>
          <ul>
            <li>
              <strong>
                Możemy od czasu do czasu aktualizować niniejszą Politykę zwrotów
              </strong>
              , aby odzwierciedlić zmiany w naszych praktykach. Zaktualizowana
              wersja zostanie opublikowana na Platformie, a data ostatniej
              aktualizacji zostanie odpowiednio zmieniona.
            </li>

            <li>
              <strong>Staramy się szybko rozwiązywać</strong> wszelkie problemy
              i gwarantować realizację każdego zamówienia. Jesteśmy bardzo
              wdzięczni za Twoją opinię i cierpliwość podczas tej fazy
              testowania.
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

export default ModalZwroty;
