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


## Dokumenty, kolory i zdjęcia

W menu **Dokumenty** utwórz folder, a następnie dodaj stronę. Tytuł i treść zapisują się automatycznie. Folder można zmienić w edytorze; usunięcie folderu przenosi jego strony do „Bez folderu”. Usunięcie strony wymaga potwierdzenia.

W dzienniku i dokumentach zaznacz fragment tekstu i kliknij kolor. Rozszerzenie Markdown używa składni `[tekst](color:red)`; dostępne są `red`, `orange`, `green`, `blue` i `purple`. Działa również z pogrubieniem, np. `[**ważne**](color:red)`. Kolory są rozszerzeniem tej aplikacji, więc inne edytory Markdown mogą wyświetlić je jako odnośniki.

**Dodaj zdjęcie** pozwala wybrać własny JPG, PNG, WebP lub GIF do 8 MB. Zdjęcie trafia do IndexedDB w przeglądarce, bez wysyłania na serwer. Markdown przechowuje odwołanie `![opis](local-image:identyfikator)`. Obrazy z zewnętrznych adresów oraz surowy HTML nie są renderowane. Usunięcie odwołania z tekstu nie usuwa fizycznie zdjęcia, ponieważ ten sam obraz może być używany w innych wpisach.

Dane są przypisane do przeglądarki i adresu aplikacji. Wyczyszczenie danych witryny usuwa także zdjęcia. **Dane → Eksportuj (JSON)** tworzy kopię wraz ze zdjęciami; import na innym urządzeniu odtwarza je lokalnie. Plik `.md` zawiera tylko tekst i odwołania, nie zawiera plików zdjęć. Starsze kopie bez dokumentów i obrazów nadal można importować; sekcje nieobecne w kopii pozostają bez zmian.

## Weryfikacja i przegląd kodu

- `bun run build` — TypeScript i kompilacja produkcyjna.
- `bun run test` — testy edycji transakcji, dokumentów, Markdown i walidacji kopii.
- [Przegląd projektu i pozostałe obszary rozwoju](docs/project-review.md).

Kategorie dokumentów można dodawać, edytować i usuwać w **Ustawienia → Dokumenty**. Każda kategoria ma nazwę i kolor; stronę można przypisać do kilku kategorii i filtrować listę niezależnie od folderów. Usunięcie kategorii usuwa wyłącznie przypisania, zachowując strony. Kategorie są częścią kopii JSON; starsze dokumenty otrzymują pustą listę kategorii.
