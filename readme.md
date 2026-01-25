# Secure Notepad App

A secure, sleek, and minimalist notepad application with a "Bauhaus" aesthetic. Features user authentication, real-time saving, and file-based storage.

## ✨ Features

*   **Secure Authentication**: User registration and login system.
*   **Persistant Storage**: Notes are saved to local JSON files (`json/notepad.json`), ensuring data isn't lost on refresh.
*   **Multi-Page Interface**: Smooth navigation between Notepad, Saved Notes, and Settings.
*   **Bauhaus UI**: A unique, high-contrast flat design with aggressive animations and parallax backgrounds.
*   **Search**: Instantly filter through your saved notes.
*   **Account Management**: Ability to delete your account and all associated data.

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14 or higher) installed on your computer.

### Installation

1.  **Clone the repository** (or download the files):
    ```bash
    git clone https://github.com/Rutaab3/notepad.git
    cd notepad
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Server**:
    ```bash
    node server.js
    ```

4.  **Open in Browser**:
    Go to `http://localhost:3000`

---

## 🌐 How to Host 24/7 (From Your PC)

You can turn your own computer into a server to access this app from anywhere (phone, other computers).

### Requirements
*   Your PC must stay **turned on** and connected to the internet.
*   The terminal running `node server.js` must stay **open**.

### Method: Cloudflare Tunnel (Recommended)
This is the safest way to expose your local server to the internet without messing with router ports.

1.  **Start your app** normally:
    ```bash
    node server.js
    ```
    *(Ensure it's running on port 3000)*

2.  **Download & Install Cloudflared**:
    [Download here](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)

3.  **Run the Tunnel**:
    Open a *new* terminal window and run:
    ```bash
    cloudflared tunnel --url http://localhost:3000
    ```

4.  **Access Anywhere**:
    Cloudflare will generate a random URL (e.g., `https://calm-desert-xc7.trycloudflare.com`). Use this link on any device to access your notepad!

---

## 🛠️ Technical Details

*   **Backend**: Node.js + Express
*   **Database**: Local JSON file system (`fs` module)
*   **Frontend**: HTML5, CSS3 (Custom + Bootstrap 5), JavaScript (Vanilla)
*   **Styling**: Custom "Bauhaus" Monochrome Theme with CSS Animations

## ⚠️ Important Note on Deployment

**You CANNOT run this app on "GitHub Pages".**
GitHub Pages only hosts static websites (HTML/CSS). This app requires a **Node.js Server** (`server.js`) to handle logins and save notes.

### To host it online (Cloud):
You must use a host that supports Node.js, such as:
*   [Render](https://render.com) (Has free tier)
*   [Railway](https://railway.app)
*   [Heroku](https://heroku.com)

Or stick to the **Home Hosting** method described above (Cloudflare Tunnel).