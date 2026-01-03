// This will work on signup/register page
const signupForm = document.getElementById('signupForm') || document.getElementById('registerForm') || document.querySelector('form');

if (signupForm && (window.location.pathname.includes('signup') || window.location.pathname.includes('register'))) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value || document.getElementById('fullName')?.value || '';
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value || document.getElementById('pass')?.value;

        const statusMessage = document.getElementById('message') || document.getElementById('loginStatus');

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (statusMessage) statusMessage.innerHTML = '<span style="color:lime;">Enlistment Successful! Redirecting...</span>';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                if (statusMessage) statusMessage.innerHTML = `<span style="color:red;">${data.message || 'Sign up failed'}</span>`;
            }
        } catch (err) {
            console.error('Registration Error:', err);
            if (statusMessage) statusMessage.innerHTML = `<span style="color:red;">Connection Error: ${err.message}. Check console.</span>`;
        }
    });
}

// This will work on login page
const loginForm = document.getElementById('loginForm') || document.querySelector('form');

if (loginForm && window.location.pathname.includes('login')) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value || document.getElementById('pass')?.value;

        const statusMessage = document.getElementById('message') || document.getElementById('loginStatus');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);  // Save login
                if (statusMessage) statusMessage.innerHTML = '<span style="color:lime;">Portal Accessed Successfully! Initializing...</span>';
                setTimeout(() => {
                    window.location.href = 'CyberSecurity Awareness.html';
                }, 1500);
            } else {
                if (statusMessage) statusMessage.innerHTML = `<span style="color:red;">${data.message || 'Access Denied'}</span>`;
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (statusMessage) statusMessage.innerHTML = `<span style="color:red;">Connection Error: ${err.message}. Check console.</span>`;
        }
    });
}

// Protect dashboard page - if not logged in, go to login
// if (window.location.pathname.includes('Dashboard.html')) {
//     if (!localStorage.getItem('token')) {
//         alert('Please login first!');
//         window.location.href = 'login.html';  // Change if your login page has different name
//     }
// }