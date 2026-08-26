# MyNotes

MyNotes is a simple, privacy-friendly notepad that opens directly in the editor. It requires no account, login, signup, database, or backend API for note-taking. Notes are stored in the browser’s `localStorage` and remain on the device where they were created.

## Features

- **Direct access:** Open the app and start writing immediately.
- **Local storage:** Notes are saved in the current browser without being uploaded.
- **Edit and update:** Reopen any saved note and continue editing it.
- **Saved Notes:** Browse, search, open, and delete notes.
- **Backup tools:** Export notes to a JSON file and import them on another browser or device.
- **Clear local data:** Remove all notes from the current browser from Settings.
- **Bauhaus-inspired interface:** A high-contrast, minimalist design with a multi-page layout.

## Getting Started

### Use the live app

Open the [MyNotes application](https://rutaabali3.github.io/notepad/) and start writing. No registration is required.

### Run locally

You need [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/rutaabali3/notepad.git
cd notepad
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000). You can also open `index.html` directly in a browser, although using the local server provides the most consistent browser behavior.

## How notes are stored

Notes are kept under the browser storage key `mynotes_local_notes`. They are local to the browser profile and are not synchronized between devices or browsers. Clearing browser site data, using private browsing, or switching browsers can remove or hide them, so use **Settings → Export notes** for backup.

The application no longer sends notes, usernames, or passwords to a server. The previous MongoDB, Express API, authentication, and account-management code has been removed from the active project.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Opens the notepad directly |
| `notepad.html` | Create and edit a note |
| `saved-notes.html` | Search, open, and delete saved notes |
| `settings.html` | Export, import, count, or clear local notes |

## Technical details

The frontend uses HTML5, CSS3, Bootstrap 5, Bootstrap Icons, SweetAlert2, and vanilla JavaScript. The optional local development server uses Node.js and Express only to serve static files. No environment variables or database credentials are required.

## Deployment

Because the application is fully client-side, it can run on GitHub Pages or any static hosting service. The repository is private, but the deployed GitHub Pages site may still be public depending on the repository and account Pages settings. Local notes are stored separately in each visitor’s browser and are never shared through the deployment.
