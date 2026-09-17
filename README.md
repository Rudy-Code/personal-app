# Personal Hub

Aplikacja webowa będąca centrum dowodzenia. Śledź finanse, zapisuj notatki w dzienniku, planuj zadania i zarządzaj projektami. Wszystko w jednym miejscu, z prostym i intuicyjnym interfejsem.

[**🔗 Zobacz projekt na żywo: https://personal.rudycode.pl/**](https://personal.rudycode.pl/)
Możesz przetestować aplikację używając przykładowych danych, które możesz pobrać z [tutaj](https://personal.rudycode.pl/sample-data.json) lub z repozytorium. Następnie kliknij Dane > Importuj kopię i wybierz pobrany plik. Po zaimportowaniu danych możesz je przeglądać, edytować i usuwać.

---

## 📸 Podgląd aplikacji

![Zrzut ekranu panelu finansów](https://personal.rudycode.pl/img/preview/finance.png)
![Zrzut ekranu panelu ustawień](https://personal.rudycode.pl/img/preview/settings.png)
![Zrzut ekranu dashboardu z command palette](https://personal.rudycode.pl/img/preview/dash-command.png)

---

## 🛠 Technologie

- **Core:** React / TypeScript
- **Styling:** Tailwind CSS / shadcn/ui
- **State Management:** Zustand
- **Build Tool:** Vite
- **Inne:** zod, date-fns, bun

---

## ✨ Funkcjonalności

Co działa na ten moment:

- **Panel Dziennika:** Tworzenie, przeglądanie, edytowanie i usuwanie wpisów w dzienniku.
- **Finanse:** Panel do zarządzania finansami:
  - Statystyki wydatków i przychodów miesięcznych
  - Wykresy i podsumowania
  - Dodawanie, edytowanie i usuwanie transakcji
  - Filtrowanie transakcji po kategoriach
  - Dodawanie i usuwanie kategorii, kont bankowych i źródeł przychodów
- **Markdown w dzienniku i dokumentach:** Wspólny edytor z podglądem, paskiem formatowania, kolorami tekstu i lokalnymi zdjęciami.
- **Dokumenty:** Osobny widok `/documents`, foldery (np. Firma), strony Markdown, automatyczny zapis, wyszukiwanie, przenoszenie stron i pobieranie plików `.md`.
- **Panel Ustawień:**
  1. Finanse:
     - Dodawanie, usuwanie i archiwizowanie kont
     - Dodawanie, edytowanie i usuwanie kategorii wydatków i przychodów
     - Ustawianie limitów i celów finansowych
  2. Styl życia:
     - Dodawanie, edytowanie i usuwanie kategorii wpisów do dziennika
- **Command Palette:** Szybkie wyszukiwanie akcji i nawigacja po aplikacji.
- **Eksport i import danych:** Możliwość eksportu i importu danych finansowych, dziennika, dokumentów i lokalnych zdjęć w formacie JSON.

---

## 🧠 Decyzje projektowe

- **Zustand zamiast Reduxa:** Wybrałem Zustand ze względu na znacznie mniejszy boilerplate, lekkość i prostotę. Aplikacja nie wymaga skomplikowanego, rozbudowanego stanu globalnego, więc takie podejście w zupełności wystarcza i przyspiesza rozwój.
- **Tailwind CSS + shadcn/ui:** To połączenie niesamowicie przyspieszyło proces stylowania. Zamiast budować podstawowe komponenty od zera, mogłem skupić się na logice biznesowej, zachowując spójny, nowoczesny wygląd i pełną kontrolę nad kodem UI.
- **Bun:** Zastąpiłem standardowego npm-a Bunem. Oferuje on znacznie szybszą instalację paczek, błyskawiczne uruchamianie skryptów i lepiej zarządza miejscem na dysku.

---

### 🗺 Roadmap (W trakcie realizacji)

- [x] **Edycja transakcji:** Możliwość modyfikowania kwot i kategorii po dodaniu wpisu
- [ ] **System treningów:** Dodawanie i prowadzenie dziennika aktywności fizycznej, z możliwością ustawiania celów i śledzenia postępów. Kalendarz z planem tygodniowym i miesięcznym, z możliwością dodawania notatek do poszczególnych dni. Plan roczny (makrocykle), liczenie passy, km oraz czasu.
- [ ] **Panel dla firmy**: Baza klientów (CRM), projekty z statusami, ewidencja sprzedaży.
- [ ] **CELE**: Możliwość ustawiania celów finansowych i życiowych, z możliwością śledzenia postępów.
- [ ] **Sprzęt**: Możliwość dodawania sprzętu sportowego, aut i innych, z możliwością śledzenia jego stanu i historii użytkowania.
- [ ] **Dokończenie Dashboardu:**
- [ ] inne

---

## 🚀 Uruchomienie lokalnie

1. Sklonuj repozytorium:
   ```bash
   git clone [https://github.com/Rudy-Code/personal-app](https://github.com/Rudy-Code/personal-app)
   ```
2. Zainstaluj zależności:
   ```bash
   cd personal-app
   bun install
   ```
3. Uruchom aplikację:
   ```bash
   bun run dev
   ```

Jeśli nie masz zainstalowanego środowiska Bun, pobierz je z [oficjalnej strony:](https://bun.com/docs/installation)

### O projekcie

Personal Hub to aplikacja stworzona z myślą o zoptymalizowaniu mojego codziennego workflow. Głównym założeniem technicznym było zbudowanie skalowalnego i łatwego w utrzymaniu interfejsu przy użyciu Reacta, lekkiego zarządzania stanem w Zustand oraz gotowych komponentów z shadcn/ui. Projekt posłużył mi jednocześnie jako środowisko testowe do ewaluacji narzędzi sztucznej inteligencji (np. GPT-6 Astra, Claude)
