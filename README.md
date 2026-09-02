# Personal Hub

Aplikacja webowa będąca centrum dowodzenia. Śledź finanse, zapisuj notatki w dzienniku, planuj zadania i zarządzaj projektami. Wszystko w jednym miejscu, z prostym i intuicyjnym interfejsem.

[**🔗 Zobacz projekt na żywo: https://personal.rudycode.pl/**](https://personal.rudycode.pl/)

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
  - Dodawanie i usuwanie nowych transakcji
  - Filtorwanie transakcji po kategoriach
  - Dodawanie i usuwanie kategorii, kont bankowych i źródeł przychodów
- **Panel Ustawień:**
  1. Finanse:
     - Dodawanie, usuwanie i archiwizowanie kont
     - Dodawanie, edytowanie i usuwanie kategorii wydatków i przychodów
     - ustawianie limitów i celów finansowych

  2. Styl życia:
     - Dodawanie, edytowanie i usuwanie kategorii wpisów do dziennika

- **Command Palette:** Szybkie wyszukiwanie akcjii i nawigacja po aplikacji.
- **Eksport i import danych:** Możliwość eksportu i importu danych finansowych i dziennika w formacie JSON.

### 🗺 Roadmap (W trakcie realizacji)

- [ ] **Edycja transakcji:** Możliwość modyfikowania kwot i kategorii po dodaniu wpisu
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
   cd personal-info-app
   bun install
   ```
3. Uruchom aplikację:
   ```bash
   bun run dev
   ```

Jeśli nie masz zainstalowanego BUN, możesz go pobrać z oficjalnej strony: [https://bun.sh/](https://bun.com/docs/installation)