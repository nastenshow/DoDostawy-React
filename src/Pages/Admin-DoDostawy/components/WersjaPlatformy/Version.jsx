import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


function ModalVersion({ isModalVisible, setModalVisible }) {
    const [status, setStatus] = useState("");
  
   
  
    if (!isModalVisible) {
      return null;
    }
  
    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header" style={{ marginBottom: "-20px" }}>
              <h1>Opis każdej wersji platformy DoDostawy</h1>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setModalVisible(false)}
                className="icon-mark"
                style={{ paddingLeft: "7px", fontWeight: "800", cursor: "pointer" }}
              />
            </div>
            <div>

              {/* Wersia 0.5.0 */}
              <p>Aktualizacja wersji: 28.03.2024</p>
              <h2>Wersja platformy 0.5.0</h2>
              <ul>
                <li>Zaprojektowany, aby zatrzymać powiadomienia o spamie;</li>
                <li>Wszystko jest skonfigurowane na serwerze;</li>
                <li>Sesja ma charakter otwarty lub zamknięty;</li>
                <li>Został zaprojektowany tak, aby logowanie do telegramów bota odbywało się poprzez nazwę użytkownika
                  telegramu;
                </li>
                <li>Stworzony tak, aby w ustawieniach było widać czy tag jest podłączony czy nie;</li>
                <li>Dodano usługę Analytics do bota Telegramu;</li>
                <li>Dodano możliwość dodania nazwy użytkownika w ustawieniach;</li>
                <li>Początkowo zgłoszono, że bot nadał pseudonim;</li>
                <li>Pseudonimy są tworzone tak, aby były unikalne;</li>
                <li>W analityce na froncie dodana została liczba zamówień dla każdego kuriera;</li>
                <li>Skonfigurowano tak, aby mieć limity żądań IP, aby uniknąć Ddos;</li>
                <li>Dodano możliwość przesyłania danych w analityce.</li>

              </ul>

              {/* Wersia 0.4.2 */}
              <p>Aktualizacja wersji: 18.03.2024</p>
              <h2>Wersja platformy 0.4.2</h2>
              <ul>
                <li>Dodano możliwość nie dodawania zleceń do rozliczenia w przypadku ich usunięcia lub posiadania statusu nie przyvne;</li>
                <li>Wykonano tak, aby rozliczenia sortowane były po 30 rekordów na stronę;</li>
                <li>Anulowane, Reklamacja, aby anulować kwoty.;</li>
                <li>Dodano w celu sprawdzania tokena co 15 sekund;</li>
                <li>Wykonane tokeny mogą wygasnąć, jeśli nie będą używane przez 5 dni;</li>
                <li>Naprawiono przycisk css niedostarcone;</li>

              </ul>

              {/* Wersia 0.4.2 */}
              <p>Aktualizacja wersji: 18.03.2024</p>
              <h2>Wersja platformy 0.4.2</h2>
              <ul>
                <li>Dodano możliwość nie dodawania zleceń do rozliczenia w przypadku ich usunięcia lub posiadania statusu nie przyvne;</li>
                <li>Wykonano tak, aby rozliczenia sortowane były po 30 rekordów na stronę;</li>
                <li>Anulowane, Reklamacja, aby anulować kwoty.;</li>
                <li>Dodano w celu sprawdzania tokena co 15 sekund;</li>
                <li>Wykonane tokeny mogą wygasnąć, jeśli nie będą używane przez 5 dni;</li>
                <li>Naprawiono przycisk css niedostarcone;</li>

              </ul>

              {/* Wersia 0.4.1 */}
              <p>Aktualizacja wersji: 14.03.2024</p>
              <h2>Wersja platformy 0.4.1</h2>
              <ul>
                <li>Naprawiono błąd w historii, dzięki czemu po przeszukaniu można przełączać się na inne strony;</li>
                <li>Naprawiono projekt w rozliczeniach;</li>
                <li>Dodano w celu uwzględnienia w rozliczeniach polskich znaków;</li>
                <li>Przeprowadzono wyszukiwanie według ulicy i numeru zamówienia;</li>
                <li>Kopia zapasowa na serwerze, wszystkich rozliczen i bazy danych są włączone. Co 6 godzin;</li>
                <li>Na serwerze włączona jest automatyzacja aktualizacji ofert;</li>
                <li>Przeprowadzono, aby usunąć zamówienia z potwierdzeniem;</li>
                <li>Naprawiono aktualizację polegającą na dodawaniu nowych ofert, aby inne restauracje nie były duplikowane;</li>
                <li>Na rozliczeniach każdej strony zestawienia obowiązuje limit ilościowy</li>

              </ul>

              {/* Wersia 0.4.0 */}
              <p>Aktualizacja wersji: 10.03.2024</p>
              <h2>Wersja platformy 0.4.0</h2>
              <ul>
                <li>Telegram bot dla zamówień;</li>
                <li>Możliwość dodania logiki dla restauracji;</li>
                <li>Przycisk do aktualizacji stawek;</li>
                <li>Generowanie dokumentów rozliczeniowych;</li>

              </ul>


              {/* Wersia 0.3.3 */}
              <p>Aktualizacja wersji: 27.02.2024</p>
              <h2>Wersja platformy 0.3.3</h2>
              <ul>
                <li>Naprawiono błąd związany z aktualizacją identyfikatora restauracji podczas zmiany strefy;</li>
                <li>Naprawiono błąd pokazujący aktualne aktualizacje map w zamówieniach;</li>

              </ul>


              {/* Wersia 0.3.2 */}
              <p>Aktualizacja wersji: 26.02.2024</p>
              <h2>Wersja platformy 0.3.2</h2>
              <ul>
                <li>Możliwość wyboru nowego numeru domu w bazie danych;</li>
                <li>Analityka zamówień dla restauracji;</li>
                <li>Dodano możliwość natychmiastowej edycji nowych adresów w edycji zamówienia. Ikona ruchu jest zielona;</li>
                <li>Napraw błąd w dodatkowych nagrodach dla kurierów;</li>
                <li>Dodano automatyczne wyszukiwanie nowych ulic, które zostały dodane z Pysznego;</li>
                <li>Dodano możliwość zmiany numeru domu podczas edycji restauracji;</li>
                <li>Dodano aby Pyszne zniknęło i zablokuj, jeśli włączysz to w ustawieniach;</li>
                <li>Naprawiono problem z kilometrami;</li>

              </ul>


              {/* Wersia 0.3.1 */}
              <p>Aktualizacja wersji: 21.02.2024</p>
              <h2>Wersja platformy 0.3.1</h2>
              <ul>
                <li>Naprawiono błąd ze stawkami;</li>
                <li>Naprawiono błąd, przez który miasto nie było w języku ukraińskim ani rosyjskim;</li>
                <li>Baza danych jest wypełniona współrzędnymi i oddzielnymi ulicami od numerów domów;</li>
                <li>Stworzony, aby wyświetlać ulice w historii;</li>
                <li>Naprawiono błąd ze strefami, przez co przy dodaniu zamówienia do jednego okna dodawana jest początkowa strefa, po czym mnożona jest druga;</li>
                <li>Poprawione numery budynków, pisane wielką literą;</li>
                <li>Dokonano tego w taki sposób, aby w dalszym ciągu istniała możliwość wybrania nowego numeru domu w bazie danych.;</li>

              </ul>


              {/* Wersia 0.3.0 */}
              <p>Aktualizacja wersji: 19.02.2024</p>
              <h2>Wersja platformy 0.3.0</h2>
              <ul>
                <li>Baza danych została zoptymalizowana;</li>
                <li>Opracowano filtr dla wartości na ulicach od A do Z;</li>
                <li>Baza danych jest wypełniona współrzędnymi i oddzielnymi ulicami od numerów domów;</li>
                <li>Utworzono dodatkowe pola na numery domów;</li>
                <li>Dodano możliwość edycji pól tak jak powiedział Andrian np. wpisz Witold, wybierz ulicę i dopiero potem dodaj numer domu;</li>
                <li>Zaimplementowano także przy zmianie ulicy lub miasta mapa automatycznie zmienia współrzędne;</li>
                <li>Dodano, aby mapa działała dla restauracji podczas dodawania zamówienia;</li>
                <li>Dodano przesunąć suwak i zapisać swój adres poprzez przypisanie współrzędnych wprowadzonej ulicy;</li>
                <li>Naprawione Pyszne do współpracy z OpenStreetMap;</li>
                <li>Zrobione osobną bazę danych, aby w przypadku zamówienia z Pysznego system nie znalazł adresu do zastąpienia adresami, które są w systemie;</li>
                <li>Rozwiązano problem z plikami cookies, dzięki czemu można od razu zalogować się do systemu, jeśli token jest ważny i znajduje się w plikach cookies;</li>
                <li>Naprawiono błąd podczas dodawania nowego numeru domu;</li>
                <li>Dodano funkcję jednoczesnego podświetlania miast;</li>
                <li>Stworzony, aby ignorować puste pola na ulicach;</li>
                <li>Stworzony do podświetlenia bezpośrednio przed wybraniem Bez ulic;</li>
                <li>Sortowanie na liście od kolejności największej do najmniejszej;</li>

              </ul>

               {/* Wersia 0.2.4 */}
               <p>Aktualizacja wersji: 12.02.2024</p>
              <h2>Wersja platformy 0.2.4</h2>
              <ul>
                <li>Napraw błąd związany z zamykaniem menu;</li>
                <li>Stworzenie interfejsu i narzędzi dla mapy;</li>
                <li>Możliwość zaznaczania restauracji na mapie;</li>
                <li>Zrealizowano rysowanie stref na mapie;</li>
                <li>Stosowany do oświetlania ulic i miast;</li>
                <li>Zaimplementowano także przy zmianie ulicy lub miasta mapa automatycznie zmienia współrzędne;</li>
                <li>Dodano, że na ulicę można było wejść, miasto się zgadza;</li>
                <li>Dodano tworzenie własnej bazy danych z nowymi i nieznanymi ulicami;</li>
                <li>Dodano możliwość dodania wszystkich stref do bazy danych;</li>
                <li>Dodano rejestrację koordynacji lokalizacji restauracji w bazie danych;</li>
                <li>Dodano możliwość wyznaczania tras z restauracji do punktu końcowego, obliczania kilometrów, a co za tym idzie stawek i tak dalej. Dla administratora;</li>
                <li>Dodano, że openstreetmap będzie filtrował po Przystankach;</li>
                <li>Naprawiono błąd z podświetlaniem punktu na mapie;</li>
                <li>Wyeksportowano ulice na mapę miasta Rzeszowa;</li>
                <li>Dodano, że restauracje mogą wybierać ulice z bazy danych;</li>
                <li>Dodano mapę, która będzie działać podczas edycji zamówienia dla administratora;</li>
                <li>Naprawiono błąd związany z wyszukiwarką w historii;</li>
                <li>Stworzony, aby przeszukiwać tylko miasta w Polsce;</li>
                <li>Dodano analitykę zamówień dla administratora;</li>
                <li>Dodano analityka zamówień dla administratora, napraw błąd w kalendarzu;</li>

              </ul>

              {/* Wersia 0.2.3 */}
              <p>Aktualizacja wersji: 17.01.2024</p>
              <h2>Wersja platformy 0.2.3</h2>
              <ul>
                <li>Dodany przy zamówieniu z Pysznego kolor będzie pomarańczowy;</li>
                <li>Dodano Pyszne okno;</li>
                <li>Backend Pyszne jest napisany dla innej technologii;</li>
                <li>Możliwość wylogowania się z konta w profilu Pyszne;</li>
                <li>Kolor dla Restauracji pochodzących z Pysznego;</li>
                <li>Ładnie zaprezentował się w barwach Pysznego;</li>
                <li>Zostało tak zrobione, aby w kalendarzu wyświetlają się tylko kurierzy, którzy znajdują się w bazie;</li>
                <li>Wykonane zamówienia znikają po 10 minutach;</li>
                <li>Skonfigurowałem serwer do pracy na amerykańskim IP dla Pysznego.;</li>
                <li>Dodano, aby można było włączać i wyłączać Pyszne;</li>
                <li>Dodano przycisk do zamówień Pyszne dla wszystkich zamówień;</li>
                <li>Zrobiłem ładniejszy przycisk Pyszne;</li>
                <li>Skonfiguruj ponowne połączenie na serwerze;</li>
                <li>Skonfigurowano wersję beta DoDostawy;</li>

              </ul>

              {/* Wersia 0.2.2 */}
              <p>Aktualizacja wersji: 07.01.2023</p>
              <h2>Wersja platformy 0.2.2</h2>
              <ul>
                <li>Możliwość stworzenia kalendarza dla każdego kuriera.;</li>
                <li>Możliwość wyboru dat i tworzenia list;</li>
                <li>Możliwość edycji list w kalendarzu;</li>
                <li>Poprawka błędu paska bocznego;</li>
                <li>Stworzono również możliwość wysyłania sugestii lub błędów pocztą;</li>
                <li>Naprawiono błąd z wiadomościami;</li>
    
              </ul>

                {/* Wersia 0.2.1 */}
              <p>Aktualizacja wersji: 05.01.2023</p>
              <h2>Wersja platformy 0.2.1</h2>
              <ul>
                <li>Zmiana swoich danych;</li>
                <li>Poprawiony numer telefonu, zaczynający się od +48;</li>
                <li>Strzałka do poprawy rozwijanie menu;</li>
                <li>Zrobione animację na pasku bocznym;</li>
                <li>Poprawiono błąd przy zmianie płatności oraz dodano automatyczne wypełnianie pola;</li>
                <li>Wykonane w taki sposób, aby plik cookie umożliwia zapamiętanie, czy pasek boczny jest otwarty, czy zamknięty;</li>
                <li>Naprawa błędu wyszukiwarki;</li>
                <li>Napraw błędy w zasięgu listy kurierów.;</li>
                <li>W ustawieniach dodano pełną informację o nowej wersji platformy;</li>

              </ul>


            {/* Wersia 0.2.0 */}
              <p>Aktualizacja wersji: 27.12.2023</p>
              <h2>Wersja platformy 0.2.0</h2>
              <ul>
                <li>Możliwość dodania każdego kuriera;</li>
                <li>Dodano możliwość dodania bardziej prawidłowego numeru telefonu;</li>
                <li>Na Czasie Dostawy robi się to na czerwono;</li>
                <li>Utworzono listę kurierów;</li>
                <li>Dodano możliwość dodawania kwoty do zamówień;</li>
                <li>Możliwość ustawienia parametrów dla każdego kuriera;</li>
                <li>Listy sporządzane są dla każdego kuriera;</li>
                <li>Napraw błąd w wyszukiwarce;</li>
                <li>Dokonano analizy dodatkowego wynagrodzenia zarobków kurierów;</li>
                <li>Uczyniono Karola domyślnym kurierem dla wszystkich zamówień;</li>
                <li>Stworzony do akceptowania gotówki lub karty;</li>
                <li>Zrobiono to tak, żeby Gotówka zmieściła się w terminie;</li>
                <li>Dodano pole wersji, w którym można wyróżnić;</li>
                <li>Zmiana danych kuriera;</li>
                <li>Możliwość edycji pól zamówień restauracji;</li>
                <li>Wersja na tablety została naprawiona, a pasek boczny został wypchnięty;</li>
                <li>Możliwość włączenia Pysznego podczas edycji restauracji.</li>
                
              </ul>

            {/* Wersia 0.1.8 */}
              <p>Aktualizacja wersji: 06.11.2023 - 05.12.2023</p>
              <h2>Wersja platformy 0.1.8</h2>
              <ul>
                <li>Zrealizowana historia dla Admina;</li>
                <li>Wszystkie wywołania API REST są skonfigurowane;</li>
                <li>Wszystkie polityki platformy są napisane;</li>
                <li>Wdrożona konstrukcja platformy;</li>
                <li>Baza danych jest skonfigurowana;</li>
                <li>Serwer jest skonfigurowany;</li>
                <li>Ustawienia zabezpieczeń i wdrożenie systemu logowania;</li>
                <li>Ustawienia kopii zapasowej;</li>
                <li>Struktura kodu na froncie i backendzie;</li>
                <li>Utworzenie tabeli zbierającej dane z bazy danych i odświeżającej je co 5 sekund;</li>
                <li>Utwórz dodane zamówienia. Z różnymi danymi;</li>
                <li>Tworzenie statusów;</li>
                <li>Możliwość anulowania zamówień;</li>
                <li>Możliwość anulowania zamówienia, jego wstępnego potwierdzenia i zwrotu w przypadku anulowania w ciągu 24 godzin;</li>
                <li>Filtruj zamówienia według kurierów;</li>
                <li>Możliwość dodania historii;</li>
                <li>Możliwość blokowania restauracji;</li>
                <li>Dodano wyszukiwanie;</li>
                <li>Możliwość edycji danych restauracji;</li>
                <li>Możliwość dodania restauracji;</li>
                <li>Skonfiguruj filtrowanie w historii;</li>
                <li>Napraw problem w Historii;</li>
                <li>Skonfiguruj żądania i usuń ograniczenia;</li>
              </ul>
    
              
            </div>
          </div>
        </div>
      );
  }



export default ModalVersion;