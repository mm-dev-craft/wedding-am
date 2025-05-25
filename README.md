# Statische Website mit Tailwind CSS

Eine moderne, responsive statische Website erstellt mit Vite und Tailwind CSS.

## 🚀 Features

- **⚡ Schnell**: Vite für ultraschnelle Entwicklung und Builds
- **🎨 Modern**: Tailwind CSS für utility-first Styling
- **📱 Responsive**: Vollständig responsives Design
- **🔄 Live-Reload**: Automatisches Browser-Refresh während der Entwicklung
- **📦 Optimiert**: Automatische Optimierung für Produktion

## 🛠️ Installation

1. Abhängigkeiten installieren:
```bash
npm install
```

## 📝 Verwendung

### Development Server starten
```bash
npm run dev
```
Startet den Development Server mit Live-Reload auf `http://localhost:5173`

### Projekt bauen
```bash
npm run build
```
Erstellt optimierte Dateien im `dist` Ordner für die Produktion

### Build-Vorschau
```bash
npm run preview
```
Startet einen lokalen Server zur Vorschau der gebauten Website

## 📁 Projektstruktur

```
├── index.html          # Haupt-HTML-Datei
├── src/
│   ├── main.js         # Haupt-JavaScript-Datei
│   └── style.css       # CSS mit Tailwind-Direktiven
├── public/             # Statische Assets
├── dist/               # Build-Output (nach npm run build)
├── tailwind.config.js  # Tailwind CSS Konfiguration
└── postcss.config.js   # PostCSS Konfiguration
```

## 🎨 Styling

Diese Website verwendet [Tailwind CSS](https://tailwindcss.com/) für das Styling. Alle Styles werden über Utility-Klassen angewendet.

### Beispiel:
```html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Schöner blauer Button mit Schatten
</div>
```

## 🚀 Deployment

Nach dem Build mit `npm run build` können alle Dateien im `dist` Ordner auf jeden statischen Hosting-Service deployed werden:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Oder jeden anderen statischen Hosting-Service

## 📦 Technologien

- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [PostCSS](https://postcss.org/) - CSS Processor
- [Autoprefixer](https://autoprefixer.github.io/) - CSS Vendor Prefixes

## 🤝 Entwicklung

Die Website ist so konfiguriert, dass:
- Änderungen an HTML, CSS oder JavaScript automatisch den Browser refreshen
- Tailwind CSS automatisch optimiert und gepurged wird
- Alle Assets korrekt in den `dist` Ordner kopiert werden

Viel Spaß beim Entwickeln! 🎉
