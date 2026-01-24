/**
 * auth.js
 * Manages UI interactions for Login and Registration.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const session = Storage.getSession();
    if (session) {
        showApp();
    } else {
        showAuth();
    }

    // Toggle between Login and Register forms
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').classList.add('d-none');
        document.getElementById('register-form').classList.remove('d-none');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').classList.add('d-none');
        document.getElementById('login-form').classList.remove('d-none');
    });

    // Handle Folder Connection
    const btnConnect = document.getElementById('btn-connect-folder');
    if (btnConnect) {
        btnConnect.addEventListener('click', async () => {
            const connected = await Storage.connectDirectory();
            if (connected) {
                Swal.fire({
                    icon: 'success',
                    title: 'Connected!',
                    text: 'Data will now save to json/users.json and notepad.json',
                    timer: 2000,
                    showConfirmButton: false
                });
                btnConnect.classList.remove('btn-outline-dark');
                btnConnect.classList.add('btn-success');
                btnConnect.disabled = true;
                btnConnect.innerHTML = '<i class="bi bi-check-circle me-2"></i>Saving to Disk';
            }
        });
    }

    // Handle Register
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (username.length < 3 || password.length < 3) {
            Swal.fire('Error', 'Username and password must be at least 3 characters.', 'error');
            return;
        }

        const newUser = await Storage.createUser(username, password);
        if (newUser) {
            Swal.fire({
                icon: 'success',
                title: 'Account Created',
                text: 'Please login with your new credentials.',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                document.getElementById('show-login').click();
                document.getElementById('login-username').value = username;
            });
        } else {
            Swal.fire('Error', 'Username already taken.', 'error');
        }
    });

    // Handle Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        const user = await Storage.loginUser(username, password);
        if (user) {
            Storage.setSession(user);
            Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                text: 'Logging you in...',
                timer: 1000,
                showConfirmButton: false
            }).then(() => {
                showApp();
            });
        } else {
            Swal.fire('Error', 'Invalid username or password.', 'error');
        }
    });

    // Logout Helper (attached to window for global access/debugging if needed, though app.js handles the button)
    window.logout = function() {
        Storage.clearSession();
        location.reload();
    };
});

function showAuth() {
    document.getElementById('auth-view').classList.remove('d-none');
    document.getElementById('app-view').classList.add('d-none');
}

function showApp() {
    document.getElementById('auth-view').classList.add('d-none');
    document.getElementById('app-view').classList.remove('d-none');
    // Trigger app initialization if needed (will be handled in app.js)
    if (window.initApp) window.initApp();
}
