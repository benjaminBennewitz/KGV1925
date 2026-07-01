<div align="center">

<img src="src/assets/img/KGV1925_Logo.webp" alt="KGV1925 Logo des Kleingartenvereins am Steinberg e.V. 1925" width="198">

# KGV1925 Website

**Kleingartenverein am Steinberg e.V. 1925**  
*Gemeinschaft. Natur. Zuhause.*

Eine helle, moderne und barrierearme Vereinswebsite mit lokal eingebundenen Assets, botanischer Gestaltung und klarer Informationsstruktur für Mitglieder, Interessierte und Besucher.

<img src="src/assets/img/lavendel-1_aquarell.webp" alt="Aquarell-Lavendel als botanisches Gestaltungselement" width="126">

</div>

---

<table>
  <tr>
    <td bgcolor="#EEF5EF">
      <h2>Projektüberblick</h2>
      <p>Die Website des <strong>Kleingartenverein am Steinberg e.V. 1925</strong> soll weit mehr sein als eine klassische Vereinspräsenz. Sie verbindet Vereinsleben, News, Termine, Service und Gartenwissen in einer ruhigen, hochwertigen Oberfläche.</p>
      <p>Im Mittelpunkt stehen gute Lesbarkeit, klare Navigation, lokale Verarbeitung, Barrierefreiheit und eine langfristig wartbare technische Grundlage.</p>
    </td>
  </tr>
</table>

## Aktueller Projektstand

```txt
Status: Projektstart
Phase: Angular-Grundlage, SSR-Setup, Asset-Struktur und Designsystem
Priorität: App Shell, Startseite, Header, Footer und Basis-Komponenten
```

<table>
  <tr>
    <td bgcolor="#F6F3EE">
      <h2>Designsystem</h2>
      <p>Das aktuelle Designsystem heißt <strong>Bright Botanical Heritage</strong>.</p>
      <p>Es verbindet Tradition, Natürlichkeit und moderne digitale Klarheit. Die Gestaltung soll hochwertig, weich und hell wirken, ohne beliebig, kitschig oder verspielt zu werden.</p>
    </td>
  </tr>
</table>

### Gestalterische Leitlinien

| Bereich | Ziel |
| --- | --- |
| Atmosphäre | warm, einladend, gepflegt und naturverbunden |
| Struktur | klar gegliederte Bereiche mit ruhigen Abständen |
| Inhalt | gute Übersicht für News, Termine, Wissen und Service |
| Interaktion | verständliche Navigation und klare Call-to-Actions |
| Wirkung | modernisiert, aber passend zur Vereinstradition |
| Technik | lokal, performant und wartbar |

<div align="center">
  <img src="src/assets/img/lavendel-2_aquarell.webp" alt="Lavendel-Aquarell als ruhiges Gestaltungselement des Designsystems" width="196">
</div>

<table>
  <tr>
    <td bgcolor="#F3EFF9">
      <h2>Farbwelt</h2>
      <p>Die Farbpalette orientiert sich am aktuellen Entwurf: helle Cremeflächen, Salbeigrün als tragende Vereinsfarbe, Lavendel als weicher Akzent und Sandtöne für saisonale Hinweise.</p>
    </td>
  </tr>
</table>

### Hauptfarben

<table>
  <tr>
    <th>Vorschau</th>
    <th>Token</th>
    <th>Wert</th>
    <th>Verwendung</th>
  </tr>
  <tr>
    <td bgcolor="#FBFAF6" width="72">&nbsp;</td>
    <td>Background</td>
    <td><code>#FBFAF6</code></td>
    <td>Grundfläche der Website</td>
  </tr>
  <tr>
    <td bgcolor="#FFFFFF" width="72">&nbsp;</td>
    <td>Surface</td>
    <td><code>#FFFFFF</code></td>
    <td>Karten, Header und helle UI-Flächen</td>
  </tr>
  <tr>
    <td bgcolor="#F6F3EE" width="72">&nbsp;</td>
    <td>Soft Cream</td>
    <td><code>#F6F3EE</code></td>
    <td>ruhige Seiten- und Zwischenflächen</td>
  </tr>
  <tr>
    <td bgcolor="#315C45" width="72">&nbsp;</td>
    <td>Primärgrün</td>
    <td><code>#315C45</code></td>
    <td>Buttons, aktive Navigation und wichtige Aktionen</td>
  </tr>
  <tr>
    <td bgcolor="#244936" width="72">&nbsp;</td>
    <td>Primärgrün Hover</td>
    <td><code>#244936</code></td>
    <td>Hover- und aktive Zustände</td>
  </tr>
  <tr>
    <td bgcolor="#EEF5EF" width="72">&nbsp;</td>
    <td>Salbei hell</td>
    <td><code>#EEF5EF</code></td>
    <td>sekundäre Naturflächen</td>
  </tr>
  <tr>
    <td bgcolor="#DFEADE" width="72">&nbsp;</td>
    <td>Salbei kräftig</td>
    <td><code>#DFEADE</code></td>
    <td>stärkere Themenflächen</td>
  </tr>
  <tr>
    <td bgcolor="#F3EFF9" width="72">&nbsp;</td>
    <td>Lavendel hell</td>
    <td><code>#F3EFF9</code></td>
    <td>freundliche Akzentflächen</td>
  </tr>
  <tr>
    <td bgcolor="#E8DFF5" width="72">&nbsp;</td>
    <td>Lavendel kräftig</td>
    <td><code>#E8DFF5</code></td>
    <td>Service-Akzente und Teaser</td>
  </tr>
  <tr>
    <td bgcolor="#D8BC7A" width="72">&nbsp;</td>
    <td>Sand</td>
    <td><code>#D8BC7A</code></td>
    <td>saisonale Hinweise und dezente Highlights</td>
  </tr>
</table>

### Kontrast- und Zustandsfarben

| Token | Wert | Verwendung |
| --- | --- | --- |
| `text-main` | `#18211B` | Haupttext und Überschriften |
| `text-muted` | `#48534B` | sekundärer Text |
| `text-soft` | `#667267` | dezente Zusatzinformationen |
| `focus` | `#6F55A0` | sichtbarer Tastaturfokus |
| `success` | `#2F6F4E` | Erfolgsmeldungen |
| `warning` | `#8A6500` | Warnhinweise |
| `error` | `#B42318` | Fehlermeldungen |
| `border` | `#D8DED6` | Standardrahmen |
| `border-soft` | `#E8ECE5` | dezente Trenner |

<table>
  <tr>
    <td bgcolor="#EEF5EF">
      <h2>Visuelle Richtung</h2>
      <p><strong>Cremeflächen, Salbeigrün und Lavendel-Akzente</strong> bilden die gestalterische Basis. Botanische Illustrationen werden sparsam eingesetzt, damit Inhalte, Formulare und wichtige Hinweise immer im Vordergrund bleiben.</p>
    </td>
  </tr>
</table>

## Typografie und UI-Sprache

Alle Schriften und Icons werden lokal ausgeliefert.

| Rolle | Font | Einsatz |
| --- | --- | --- |
| Display | Fraunces | Hero-Headlines, redaktionelle Überschriften |
| UI und Fließtext | Inter | Navigation, Texte, Formulare, Buttons |
| Icons | Material Symbols | unterstützende UI-Icons |

### Formensprache

| Element | Vorgabe |
| --- | --- |
| Buttons | `0.625rem` Radius |
| Inputs | `0.625rem` Radius mit sichtbarem Fokus |
| Karten | `1.25rem` Radius, dezenter Rahmen, weicher Schatten |
| Hero-Bilder | `1.75rem` Radius |
| Modals | `1.75rem` Radius |
| Pills | `9999px` Radius |
| Standard-Schatten | `0 18px 48px rgba(24, 33, 27, 0.08)` |
| Hover-Schatten | `0 24px 64px rgba(24, 33, 27, 0.12)` |

<table>
  <tr>
    <td bgcolor="#F6F3EE">
      <h2>Projektziele</h2>
      <p>Die Website soll Vereinsinformationen verständlich bündeln, Besucher ansprechen, Mitglieder informieren und spätere Erweiterungen wie einen geschützten Mitgliederbereich sauber vorbereiten.</p>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td bgcolor="#FFFFFF"><strong>Aktuelles</strong><br>News, Hinweise und Vereinsinformationen sichtbar machen</td>
    <td bgcolor="#F3EFF9"><strong>Termine</strong><br>Veranstaltungen und Kalender übersichtlich darstellen</td>
  </tr>
  <tr>
    <td bgcolor="#EEF5EF"><strong>Gartenwissen</strong><br>Tipps, Inhalte und Inspirationen zugänglich machen</td>
    <td bgcolor="#F6F3EE"><strong>Service</strong><br>Formulare, Downloads und Vereinshaus-Anfragen bereitstellen</td>
  </tr>
</table>

Weitere Ziele:

- repräsentative Website für Mitglieder und Besucher
- Accessibility-Modus früh mitdenken
- Mitgliederbereich später ergänzen
- responsive Nutzung bis 320 px Viewport-Breite
- gute Print-Ausgabe für relevante Inhalte
- keine unnötigen Cookies
- keine externen Tracking-, Font- oder Drittanbieter-Dienste
- gute Performance auf Desktop, Tablet und Mobile

## Technische Grundlage

| Bereich | Technologie |
| --- | --- |
| Frontend | Angular |
| Rendering | Angular SSR |
| Styling | SCSS |
| Routing | Angular Router |
| Assets | lokale Bilder und lokale Fonts |
| Icons | lokale Material Symbols |
| Backend geplant | Django REST Framework |
| Datenbank geplant | PostgreSQL |
| Background Jobs geplant | Celery und Redis |

## Geplante Hauptbereiche

```txt
Startseite
├── Verein
├── Aktuelles
├── Termine
├── Gartenwissen
├── Service
├── Kontakt
└── Mitgliederbereich
```

Der Mitgliederbereich hat zunächst geringe Priorität und wird später erweitert.

<table>
  <tr>
    <td bgcolor="#F3EFF9">
      <h2>Asset-Struktur</h2>
      <p>Die README-Verknüpfungen sind an die tatsächlich im Projekt vorhandenen Dateien angepasst. Damit die Bilder auf GitHub sichtbar sind, darf <code>src/assets</code> nicht vollständig durch <code>.gitignore</code> ausgeschlossen werden.</p>
    </td>
  </tr>
</table>

```txt
public/
└── favicon.ico

src/assets/
├── fonts/
│   ├── license/
│   │   ├── OFL.txt
│   │   └── README.txt
│   ├── Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf
│   ├── inter-variable.ttf
│   └── material-symbols-outlined-latin-fill-normal.woff2
└── img/
    ├── Entwurf/
    │   └── Entwurf-Startseite.png
    ├── KGV1925_Logo.webp
    ├── lavendel-1_aquarell.webp
    ├── lavendel-2_aquarell.webp
    ├── lavendel-3_aquarell.webp
    └── lavendel-4_aquarell.webp
```

### In der README verwendete Bilder

| Zweck | Datei |
| --- | --- |
| Logo | `src/assets/img/KGV1925_Logo.webp` |
| Lavendel oben | `src/assets/img/lavendel-1_aquarell.webp` |
| Lavendel Mitte | `src/assets/img/lavendel-2_aquarell.webp` |
| Lavendel unten | `src/assets/img/lavendel-4_aquarell.webp` |

## Entwicklung starten

Repository installieren:

```bash
npm install
```

Lokalen Entwicklungsserver starten:

```bash
npm start
```

Anschließend im Browser öffnen:

```txt
http://localhost:4200
```

## Angular CLI

Komponente erzeugen:

```bash
npx ng generate component components/example
```

Build erstellen:

```bash
npx ng build
```

Tests ausführen:

```bash
npx ng test
```

SSR-Build lokal starten:

```bash
npm run build
npm run serve:ssr:kgv1925
```

## Entwicklungsregeln

- Quellcode bleibt verständlich, wartbar und nachvollziehbar
- TypeScript-Kommentare werden im JSDoc-Format geschrieben
- SCSS enthält keine Inline-Kommentare
- SCSS-Dateien erhalten keine Pfadangabe am Dateianfang
- neue Dateien werden mit CRLF gespeichert
- Dateien werden logisch nach Feature und Funktion strukturiert
- Assets werden lokal eingebunden
- Fonts werden lokal ausgeliefert
- keine externen Font-CDNs
- keine unnötigen Drittanbieter-Dienste
- nach abgeschlossenen Kernfeatures wird direkt committet

<table>
  <tr>
    <td bgcolor="#EEF5EF">
      <h2>Accessibility</h2>
      <p>Barrierefreiheit wird direkt mitentwickelt. Ziel sind klare Kontraste, sichtbare Fokuszustände, verständliche Linktexte und eine gute Bedienbarkeit auf kleinen Viewports.</p>
    </td>
  </tr>
</table>

Wichtige Grundlagen:

- semantisches HTML
- sichtbare Fokuszustände
- ausreichende Kontraste
- große Touch-Flächen
- verständliche Linktexte
- reduzierte Bewegung bei `prefers-reduced-motion`
- gute Lesbarkeit bis 320 px Viewport-Breite
- sinnvolle Alternativtexte für relevante Bilder
- keine Informationen ausschließlich über Farbe
- Formulare mit sichtbaren Labels und verständlichen Fehlermeldungen

<table>
  <tr>
    <td bgcolor="#F6F3EE">
      <h2>Performance</h2>
      <p>Die Website soll leichtgewichtig bleiben. Lokale Fonts, optimierte Bilder, sparsame Animationen und eine klare SCSS-Struktur sind deshalb Teil der technischen Basis.</p>
    </td>
  </tr>
</table>

Dazu gehören:

- optimierte WebP- oder AVIF-Bilder
- lokale Schriften
- kleine wiederverwendbare Komponenten
- keine unnötigen Animationen
- keine teuren Blur-Effekte
- kein Tracking
- keine externen Font-CDNs
- klare SCSS-Struktur
- responsive Bilder und sparsame dekorative Assets

## Empfohlene Komponenten-Reihenfolge

```txt
App Shell
├── Header
├── Footer
├── Button
├── Card
├── Section Wrapper
├── Feature Card
├── News Teaser
├── Event Teaser
└── Accessible Form Field
```

## Commit-Konvention

Commits werden auf Englisch geschrieben.

Beispiele:

```bash
git commit -m "feature(app-shell): initialize Angular layout"
git commit -m "feature(home): add botanical hero section"
git commit -m "fix(header): improve mobile navigation contrast"
git commit -m "docs(readme): align README with current design system"
```

Erlaubte Prefixe:

```txt
docs
fix
feature
refactor
```

---

<div align="center">

<img src="src/assets/img/lavendel-4_aquarell.webp" alt="Dezenter Lavendel-Abschluss für die KGV1925 Website" width="84">

**KGV1925 Website**  
Bright Botanical Heritage für eine moderne Vereinswebsite.

</div>
