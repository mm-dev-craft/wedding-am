# Internationalisierung (i18n)

Die Website unterstützt mehrere Sprachen durch ein modulares Internationalisierungssystem.

## Unterstützte Sprachen

- **Deutsch (de)** - Standardsprache
- **Russisch (ru)** 
- **Serbisch (sr)**

## Struktur

### Locale-Dateien
```
src/locales/
├── de.json    # Deutsche Übersetzungen
├── ru.json    # Russische Übersetzungen
└── sr.json    # Serbische Übersetzungen
```

### Kernkomponenten
- **`src/i18n.js`** - Internationale Utility-Klasse
- **`src/main.js`** - Hauptintegration und DOM-Updates

## Wie es funktioniert

### 1. Übersetzungsschlüssel
Texte werden über verschachtelte Schlüssel organisiert:
```json
{
  "hero": {
    "title": "Wir heiraten!",
    "description": "Liebe Familie und Freunde..."
  }
}
```

### 2. HTML-Integration
Elemente werden mit `data-i18n` Attributen markiert:
```html
<h1 data-i18n="hero.title">Wir heiraten!</h1>
<p data-i18n="hero.description">...</p>
```

### 3. Spezielle Attribute
- **`data-i18n`** - Standard Textinhalt
- **`data-i18n-html`** - HTML-Inhalt (mit `<br>` für Zeilenumbrüche)
- **`data-i18n-list`** - Arrays von Listenelementen
- **`data-i18n-attr`** - Aktualisiert Attribute statt Textinhalt

### 4. Automatische Updates
Beim Sprachwechsel werden automatisch aktualisiert:
- Seitentitel und Meta-Beschreibung
- HTML `lang` Attribut
- Alle markierten Textelemente
- Sprachschaltfläche

## Neue Sprache hinzufügen

1. **Locale-Datei erstellen:**
   ```
   src/locales/[sprachcode].json
   ```

2. **Sprachkonfiguration erweitern:**
   ```javascript
   // main.js
   const languages = {
     de: { name: 'Deutsch', flag: '🇩🇪' },
     ru: { name: 'Русский', flag: '🇷🇺' },
     sr: { name: 'Српски', flag: '🇷🇸' },
     // Neue Sprache hinzufügen
     en: { name: 'English', flag: '🇬🇧' }
   }
   
   const languageOrder = ['de', 'ru', 'sr', 'en']
   ```

3. **i18n Unterstützung aktualisieren:**
   ```javascript
   // i18n.js
   this.supportedLanguages = ['de', 'ru', 'sr', 'en']
   ```

## Übersetzungen bearbeiten

1. Öffne die entsprechende Datei in `src/locales/`
2. Bearbeite die JSON-Struktur
3. Der Build-Prozess lädt die Änderungen automatisch

## Technische Details

### Persistierung
- Gewählte Sprache wird in `localStorage` gespeichert
- Beim nächsten Besuch wird die gespeicherte Sprache geladen

### Fallback-Mechanismus
- Bei fehlenden Übersetzungen wird auf Deutsch zurückgegriffen
- Bei nicht unterstützten Sprachen wird Deutsch geladen

### Performance
- Übersetzungen werden lazy geladen (erst beim ersten Gebrauch)
- Geladene Sprachen werden im Speicher zwischengespeichert
