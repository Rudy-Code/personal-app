# Przegląd projektu — 7 września 2026

## Architektura

Frontend to React i TypeScript, z trasami ładowanymi na żądanie w `src/main.tsx`. Układ, menu i paleta poleceń korzystają ze wspólnej konfiguracji nawigacji. Komponenty UI opierają się na Base UI, Tailwind i wspólnych tokenach kolorów. Formularze finansów i dziennika używają React Hook Form oraz Zod.

Finanse i dziennik korzystają z Zustand i localStorage. Salda oraz wykresy są wyliczane na podstawie listy transakcji — edycja istniejącego rekordu aktualizuje więc widoki bez dodatkowego magazynu sald. Dziennik odtwarza daty przy odczycie zapisanych danych oraz ma migrację starszego formatu.

Backend Express/Socket.IO obsługuje transmisję treningu. Nie zapisuje finansów, dziennika ani dokumentów. Nowe funkcje nie wymagają zmian backendu ani konta użytkownika.

## Zrealizowane zmiany

- Podłączono akcję edycji transakcji do istniejącego systemu modali. Ten sam formularz obsługuje dodawanie i edycję przychodu, wydatku i transferu; zachowuje identyfikator i opis. Walidacja środków odejmuje wpływ starej transakcji z salda wybranego konta. Zmiana typu czyści niepasującą kategorię, a zapis usuwa nieaktualne pole konta docelowego lub kategorii.
- Wspólny edytor i renderer Markdown dla dziennika i dokumentów: GFM, formatowanie zaznaczenia, pięć kolorów, podgląd i lokalne obrazy. Zamiast włączać surowy HTML, kolory są renderowane z kontrolowanej listy. Renderer nie pobiera obrazów z Internetu.
- Obrazy zapisują się w IndexedDB, dzięki czemu nie zajmują małego limitu localStorage. Obsługiwane są błędy plików i zapisu. Obrazy pozostają lokalne i są dołączane do kopii JSON.
- Dodano widok Dokumenty, foldery i strony, zmianę nazw, przenoszenie, usuwanie, wyszukiwanie tytułów i treści, automatyczny zapis oraz eksport `.md`. Zapis dokumentów najpierw utrwala dane, a dopiero potem publikuje stan; błąd zapisu pozostawia treść w edytorze z możliwością ponowienia.
- Import waliduje wszystkie sekcje przed zapisem i zachowuje obsługę starszych kopii. Eksport używa Blob zamiast dużego adresu data URL.
- Ochrona niezapisanych zmian w dzienniku i podczas dodawania zdjęć. Formularz dziennika nie pozwala zapisać wpisu przed zakończeniem dodawania zdjęcia.
- Poprawiono filtrowanie dziennika po identyfikatorze kategorii. Nawigacja mobilna zamyka menu po wyborze strony.

## Sprawdzenie

Testy automatyczne obejmują wpływ edytowanych transferów na konta, zachowanie ID transakcji, usuwanie nieaktualnych pól, zapis i przenoszenie dokumentów, błąd braku miejsca, kolory i GFM, blokadę zewnętrznych obrazów i niebezpiecznych URL, limity plików oraz walidację i zgodność kopii.

Dodatkowo sprawdzono w przeglądarce Edge: edycję transferu z zachowaniem opisu, zapis dziennika, tworzenie folderów i stron, automatyczny zapis po odświeżeniu, wybór i renderowanie lokalnego zdjęcia, eksport kopii i import w nowym kontekście przeglądarki, formatowanie zaznaczenia, usuwanie folderu bez utraty stron oraz usuwanie strony. Widok dokumentów sprawdzono przy szerokości 390 i 1440 px.

## Pozostałe obszary projektu

To niezależne, istniejące wcześniej obszary do dalszego rozwoju:

- Nawigacja zawiera trasy sprzętu, budżetu, sprzedaży i CRM, dla których nie ma jeszcze ekranów w routerze. Dokumenty są przestrzenią notatek, nie implementacją CRM czy ewidencji sprzedaży.
- Dashboard zawiera dane demonstracyjne: cele, odliczanie, trening i wartości biznesowe. Część przycisków i akcji palety poleceń pozostaje atrapami.
- Widok treningów jest szkieletem. Transmisja live ma osobny moduł, ale backend przechowuje tylko ostatnią aktualizację w pamięci, używa stałego pokoju i nie ma uwierzytelniania nadawcy.
- Pełny lint projektu zgłasza wcześniejsze problemy w komponentach UI, hookach mediów, wykresie oraz typach modułu live. Zmienione pliki i nowe moduły są sprawdzane osobno; nie wyłączono istniejących reguł lintowania.
- Brak synchronizacji danych między urządzeniami. Do przenoszenia danych służy kopia JSON. Automatyczne usuwanie nieużywanych zdjęć nie jest wdrożone, aby nie uszkodzić odwołań skopiowanych między stronami.
