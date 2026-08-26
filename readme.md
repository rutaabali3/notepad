# MyNotes

MyNotes is a simple, privacy-friendly notepad that opens directly in the editor. It requires no account, login, signup, npm, server, database, or backend API. Notes are stored in the browser’s `localStorage` and remain on the device where they were created.

## Features

- **Direct access:** Open `index.html` and start writing immediately.
- **Local storage:** Notes are saved in the current browser without being uploaded.
- **Edit and update:** Reopen any saved note and continue editing it.
- **Saved Notes:** Browse, search, open, and delete notes.
- **Backup tools:** Export notes to a JSON file and import them on another browser or device.
- **Clear local data:** Remove all notes from the current browser from Settings.
- **Dark mode:** Switch to a softer dark theme from the sidebar; the preference is remembered in this browser.
- **Bauhaus-inspired interface:** A high-contrast, minimalist design with a multi-page layout.

## Use the app

### On your computer

Download or clone the repository, then double-click `index.html`. The app runs entirely in the browser. No installation or terminal commands are required.

### On static hosting

Upload the project files to any static host, such as GitHub Pages, Netlify, or Cloudflare Pages. The application consists only of HTML, CSS, and JavaScript files.

## How notes are stored

Notes are kept under the browser storage keys `mynotes_local_notes` and `mynotes_theme`.
 They are local to the browser profile and are not synchronized between devices or browsers. Clearing browser site data, using private browsing, or switching browsers can remove or hide them, so use **Settings → Export notes** for backup.

The application does not send notes, usernames, or passwords to a server. MongoDB, Express, authentication, Node.js, npm, and account-management code are not required.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Opens the notepad directly |
| `notepad.html` | Create and edit a note |
| `saved-notes.html` | Search, open, and delete saved notes |
| `settings.html` | Export, import, count, or clear local notes |

## Project structure

```text
css/style.css
index.html
notepad.html
saved-notes.html
settings.html
js/storage.js
js/theme.js
js/notepad.js
js/saved-notes.js
js/settings.js
readme.md
```

## Technical details

The app uses HTML5, CSS3, Bootstrap 5, Bootstrap Icons, SweetAlert2, and vanilla JavaScript. Bootstrap, Bootstrap Icons, and SweetAlert2 are loaded from public CDNs when the pages are opened online. Note creation and editing still work without an account or database; an internet connection is only needed to load those optional visual libraries when they are not cached.
