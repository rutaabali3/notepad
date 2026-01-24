/**
 * settings.js
 * Settings page logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    const session = Storage.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    document.getElementById('current-user-name').textContent = session.username;
    document.getElementById('settings-username').value = session.username;
    document.getElementById('settings-uid').value = session.id;

    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        Storage.clearSession();
        window.location.href = 'login.html';
    });

    // Delete account
    document.getElementById('btn-delete-account').addEventListener('click', async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete your account and all notes!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff0000ff',
            cancelButtonColor: '#0084ffff',
            confirmButtonText: 'Yes, delete everything!'
        });

        if (result.isConfirmed) {
            const success = await Storage.deleteUser(session.id);
            if (success) {
                Storage.clearSession();
                Swal.fire({
                    icon: 'success',
                    title: 'Account Deleted',
                    text: 'Your account and all notes have been deleted.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            } else {
                Swal.fire('Error', 'Failed to delete account. Please try again.', 'error');
            }
        }
    });
});
