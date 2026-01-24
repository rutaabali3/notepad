/**
 * login.js
 * Login page specific logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const session = Storage.getSession();
    if (session) {
        window.location.href = 'notepad.html';
        return;
    }

    // Toggle forms
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
            window.location.href = 'notepad.html';
        } else {
            Swal.fire('Error', 'Invalid username or password.', 'error');
        }
    });
});
