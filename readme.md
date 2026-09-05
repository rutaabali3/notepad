# MyNotes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Browser--Based-brightgreen.svg)](#technical-architecture)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Build-orange.svg)](#getting-started)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-success.svg)](#data-privacy--storage)

MyNotes is a high-performance, privacy-centric, client-side web notepad application designed for seamless note-taking without backend dependencies, user registrations, tracking, or build tools. Built with modern Web APIs, modern HTML5, CSS3, and vanilla JavaScript, MyNotes provides instant editor access, rich text formatting, live text statistics, dictionary-based spell checking, dark theme integration, and complete local data control.

---

## Quick Navigation

- [Key Features](#key-features)
- [Feature Matrix](#feature-matrix)
- [Getting Started](#getting-started)
- [Application Pages](#application-pages)
- [Project Architecture](#project-architecture)
- [Data Privacy & Storage](#data-privacy--storage)
- [Technical Architecture](#technical-architecture)
- [Interactive Guide & Details](#interactive-guide--details)
- [Contributing & License](#contributing--license)

---

## Key Features

- **Zero-Latency Launch:** Opens directly into the editing canvas with zero authentication or server roundtrips.
- **Rich Text Suite:** Comprehensive formatting including bold, italic, underline, heading hierarchy, blockquotes, ordered/unordered lists, and hyperlink management.
- **Real-Time Analytics:** Live telemetry tracking words, total characters, sentences, and estimated reading time as you type.
- **Integrated Spell Check:** Dictionary-assisted spell checking powered by Hunspell via Typo.js running entirely client-side.
- **Search & Filter Engine:** Instant, multi-keyword search across titles and rich text content with dynamic match count summary.
- **Data Portability:** Full backup capability with JSON export and schema-validated import utilities.
- **Bauhaus Design System:** Modern, high-contrast user interface engineered with dark mode aesthetics and responsive sidebar navigation.

---

## Feature Matrix

| Feature | MyNotes | Cloud Notepads | Standard Plain Text Editors |
| :--- | :---: | :---: | :---: |
| **Server Requirement** | None (100% Client-Side) | Required | None |
| **User Account / Login** | Not Required | Required | Not Required |
| **Data Storage Location** | Browser Local Storage | Cloud Server | Local File System |
| **Rich Text Formatting** | Supported | Supported | Not Supported |
| **Live Word & Reading Stats** | Supported | Varies | Rare |
| **Client-Side Spell Checker** | Supported | Cloud Dependent | OS Dependent |
| **Data Import / Export** | JSON Backup & Restore | Proprietary Sync | Raw Text Files |
| **Build Tools / npm Needed** | Zero Build Step | Complex Toolchains | None |

---

## Getting Started

### Method 1: Local Computer Execution

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/mynotes.git
   ```
2. Open the directory:
   ```bash
   cd mynotes
   ```
3. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge). No server, terminal execution, or node dependencies required.

### Method 2: Static Cloud Deployment

Deploy the repository directory to any static web hosting platform:

- **GitHub Pages:** Enable GitHub Pages under Repository Settings -> Pages.
- **Netlify:** Drag and drop the project folder into Netlify Web Console.
- **Vercel / Cloudflare Pages:** Connect repository with default static settings.

---

## Application Pages

```
+-------------------------------------------------------------------------+
|                                MYNOTES                                  |
+--------------------+----------------------------------------------------+
| Navigation Sidebar | Page View                                          |
+--------------------+----------------------------------------------------+
| - Notepad          | index.html         --> Redirects to editor         |
| - Saved Notes      | notepad.html       --> Editor & rich text canvas   |
| - Settings         | saved-notes.html   --> Searchable notes list      |
|                    | settings.html      --> Storage stats & backups     |
+--------------------+----------------------------------------------------+
```

### Detailed Breakdown

| File Name | Functional Role | Highlights |
| :--- | :--- | :--- |
| `index.html` | Application Gateway | Immediate redirect to `notepad.html` for instant note creation. |
| `notepad.html` | Core Editor Workspace | Contenteditable canvas, formatting toolbar, live stats panel, spell checker drawer. |
| `saved-notes.html` | Vault & Search Interface | Card grid display, real-time keyword filter, note deletion and editing triggers. |
| `settings.html` | Control Panel | Storage meter, JSON backup export, file import validation, wipe storage action. |

---

## Project Architecture

```
mynotes/
├── css/
│   └── style.css            # Primary style definitions and Bauhaus dark theme
├── js/
│   ├── notepad.js           # Editor actions, toolbar commands, DOM bindings
│   ├── saved-notes.js       # Search, filter, and card renderer logic
│   ├── settings.js          # Export, import, and storage reset handlers
│   ├── sidebar.js           # Mobile responsive sidebar and drawer navigation
│   ├── spellcheck.js        # Typo.js dictionary integration and inline alerts
│   ├── stats.js             # Live word, character, sentence, and reading calculator
│   ├── storage.js           # LocalStorage wrapper, sanitization, and JSON parsing
│   └── theme.js             # Global theme settings initializer
├── CONTRIBUTING.md          # Contribution guidelines and workflow rules
├── LICENSE                  # MIT License legal documentation
├── index.html               # Entry point
├── notepad.html             # Editor page view
├── readme.md                # Project documentation
├── saved-notes.html         # Saved notes overview page
└── settings.html            # Settings and data management page
```

---

## Data Privacy & Storage

MyNotes is engineered around strict privacy principles:

- **LocalStorage Keys:**
  - `mynotes_local_notes`: Encoded array containing note ID, title, rich text HTML content, and timestamps (`createdAt`, `updatedAt`).
  - `mynotes_theme`: Theme setting configuration.
- **Security & Sanitization:** All HTML input undergoes tag filtering prior to storage or rendering (`A`, `B`, `BLOCKQUOTE`, `BR`, `EM`, `H1`, `H2`, `H3`, `I`, `LI`, `OL`, `P`, `STRONG`, `U`, `UL`).
- **Data Isolation:** Data is isolated within the local browser profile and never transmitted across network requests.

---

## Technical Architecture

```
+-----------------------------------------------------------------+
|                        Browser Environment                      |
|                                                                 |
|  +---------------------+    +--------------------------------+  |
|  |   HTML5 / DOM UI    |<-->|    Vanilla JS Core Logic      |  |
|  +---------------------+    +--------------------------------+  |
|             |                               |                   |
|             v                               v                   |
|  +---------------------+    +--------------------------------+  |
|  | CSS3 / Bootstrap 5  |    |  Browser LocalStorage API      |  |
|  +---------------------+    +--------------------------------+  |
|                                             ^                   |
|                                             |                   |
|                             +--------------------------------+  |
|                             |  JSON Backup Export / Import   |  |
|                             +--------------------------------+  |
+-----------------------------------------------------------------+
```

---

## Interactive Guide & Details

<details>
<summary><b>Click to expand: How to Export and Import Notes</b></summary>

<br>

### Exporting Notes
1. Open the application and navigate to **Settings** via the sidebar.
2. Under the **Backup and Restore** section, click **Export Notes**.
3. A JSON file named `mynotes-YYYY-MM-DD.json` will be automatically generated and downloaded.

### Importing Notes
1. Navigate to **Settings** on the destination device or browser.
2. Click **Import Notes** and select a valid MyNotes JSON export file.
3. The system validates the JSON schema and appends the notes to your local storage inventory.
</details>

<details>
<summary><b>Click to expand: Rich Text Editing Keyboard Shortcuts & Capabilities</b></summary>

<br>

- **Bold:** `Ctrl + B` / `Cmd + B`
- **Italic:** `Ctrl + I` / `Cmd + I`
- **Underline:** `Ctrl + U` / `Cmd + U`
- **Link Insertion:** Select text and click the Link button to attach custom hyperlinks.
- **Live Statistics Engine:** Calculates statistics dynamically on every keyup and input event.
</details>

<details>
<summary><b>Click to expand: Browser Compatibility & Technical Dependencies</b></summary>

<br>

- **Browser Compatibility:** Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+.
- **CDN Resources:** Uses Bootstrap 5 CSS, Bootstrap Icons, SweetAlert2, and Typo.js loaded via public CDN.
- **Offline Operations:** Core editing and persistence remain functional offline after initial asset caching.
</details>

---

## Contributing & License

Contributions are always welcome. Please consult the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines regarding issue reporting, code formatting, and pull request procedures.

This project is licensed under the terms of the [MIT License](LICENSE).
