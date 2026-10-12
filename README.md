# Personal Hub (RudyCore)

Aplikacja webowa będąca osobistym centrum dowodzenia. Śledź finanse, zapisuj notatki w dzienniku, twórz bazę wiedzy w dokumentach Markdown i synchronizuj swoje dane w chmurze. Wszystko w jednym miejscu, z prostym i intuicyjnym interfejsem.

[**🔗 Zobacz projekt na żywo: https://personal.rudycode.pl/**](https://personal.rudycode.pl/)

---

## 🧪 Konto demonstracyjne (Demo)

Aplikacja posiada wbudowane konto demonstracyjne z przygotowanym zestawem przykładowych danych (konta bankowe, transakcje finansowe, wpisy w dzienniku oraz dokumenty Markdown):

- **Login:** `demo`
- **Hasło:** `demo123`

> Na ekranie logowania (`/login`) możesz również kliknąć przycisk **„Wypełnij”**, aby automatycznie uzupełnić dane konta demonstracyjnego. Po zalogowaniu przykładowe dane wczytają się automatycznie z serwera.
>
> Nadal możesz także ręcznie wyeksportować lub zaimportować plik JSON z poziomu menu użytkownika (klikając **Avatar w prawym górnym rogu** → *Eksportuj / Importuj kopię*). Przykładowy plik znajduje się również w [`public/sample-data.json`](public/sample-data.json).

---

## 📸 Podgląd aplikacji

![Zrzut ekranu panelu finansów](https://personal.rudycode.pl/img/preview/finance.png)
![Zrzut ekranu panelu ustawień](https://personal.rudycode.pl/img/preview/settings.png)
![Zrzut ekranu dashboardu z command palette](https://personal.rudycode.pl/img/preview/dash-command.png)

---

## 🛠 Technologie

### Frontend
- **Core:** React 19 / TypeScript / React Router v7
- **Styling:** Tailwind CSS v4 / shadcn/ui (`@base-ui/react`)
- **State Management:** Zustand (z `persist` oraz synchronizacją z chmurą)
- **Formularze i walidacja:** React Hook Form + Zod
- **Build Tool:** Vite

### Backend
- **Runtime & Framework:** Node.js + Express
- **Autoryzacja:** JWT (`jsonwebtoken`) + `bcryptjs`
- **Baza danych:** Plikowy magazyn JSON per użytkownik (`backend/data/`)
- **Real-time:** Socket.IO (śledzenie trasy biegowej na żywo `/live` oraz `/spectator`)

---

## ✨ Funkcjonalności

- **Autoryzacja i Synchronizacja z Chmurą:**
  - Logowanie i rejestracja użytkowników (`/login`) zabezpieczone tokenami JWT
  - Ochrona tras (`AuthGuard`) oraz menu użytkownika pod avatarem z inicjałami
  - **Auto-zapis (Cloud Auto-Save):** Automatyczna synchronizacja zmian z serwerem w tle
  - Ręczny zapis i odczyt danych z chmury oraz lokalny eksport/import plików `.json`
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
  3. Dokumenty:
     - Zarządzanie folderami i strukturą dokumentów
- **Command Palette:** Szybkie wyszukiwanie akcji i nawigacja po aplikacji (`Ctrl+K`).

---

## 🧠 Decyzje projektowe

- **Zustand + Cloud Sync:** Połączenie lokalnego `persist` w Zustand z lekkim backendem Express przechowującym strukturę JSON per użytkownik daje błyskawiczne działanie interfejsu (offline-first) przy jednoczesnej kopii zapasowej i synchronizacji między urządzeniami.
- **Tailwind CSS + shadcn/ui:** Pozwoliło skupić się na logice biznesowej, zachowując spójny, nowoczesny wygląd i pełną kontrolę nad kodem UI.
- **Bun / Node.js:** Szybka instalacja paczek i uruchamianie skryptów deweloperskich.

---

### 🗺 Roadmap (W trakcie realizacji)

- [x] **Edycja transakcji:** Możliwość modyfikowania kwot i kategorii po dodaniu wpisu
- [x] **Konta użytkowników i synchronizacja z backendem Node.js**
- [ ] **System treningów:** Dodawanie i prowadzenie dziennika aktywności fizycznej, z możliwością ustawiania celów i śledzenia postępów.
- [ ] **Panel dla firmy:** Baza klientów (CRM), projekty ze statusami, ewidencja sprzedaży.
- [ ] **Cele:** Możliwość ustawiania celów finansowych i życiowych ze śledzeniem postępów.
- [ ] **Sprzęt:** Możliwość dodawania sprzętu sportowego, aut i innych, ze śledzeniem stanu i historii użytkowania.

---

## 🚀 Uruchomienie lokalnie

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/Rudy-Code/personal-app
cd personal-app
```

### 2. Uruchom backend (Node.js)
```bash
cd backend
npm install
npm start
```
Serwer API wystartuje domyślnie na `http://localhost:3001` i automatycznie utworzy konto demonstracyjne (`demo` / `demo123`) wraz z przykładowymi danymi z `public/sample-data.json`.

### 3. Uruchom frontend (w drugim terminalu)
```bash
bun install
bun run dev
# lub: npm install && npm run dev
```
Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

---

### O projekcie

Personal Hub to aplikacja stworzona z myślą o zoptymalizowaniu codziennego workflow. Głównym założeniem technicznym było zbudowanie skalowalnego i łatwego w utrzymaniu interfejsu przy użyciu Reacta, lekkiego zarządzania stanem w Zustand, gotowych komponentów UI oraz dedykowanego backendu Node.js.
