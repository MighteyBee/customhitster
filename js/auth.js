// auth.js
const supabase = window.supabase.client;

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const showSignupButton = document.getElementById("showSignupButton");
const showLoginButton = document.getElementById("showLoginButton");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

// Back to menu
document.getElementById("backButton").onclick = () => {
    window.location.href = "index.html";
};

// Show signup
showSignupButton.onclick = () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
};

// Show login
showLoginButton.onclick = () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
};

// Login
loginButton.onclick = async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter your email and password.";
        return;
    }

    loginButton.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            loginMessage.textContent = error.message;
            loginButton.disabled = false;
            return;
        }

        // Successfully logged in
        window.location.href = "index.html";
    } catch (error) {
        loginMessage.textContent = error.message;
        loginButton.disabled = false;
    }
};

// Create account
signupButton.onclick = async () => {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!email || !password) {
        signupMessage.textContent = "Please enter an email and password.";
        return;
    }

    signupButton.disabled = true;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            signupMessage.textContent = error.message;
            signupButton.disabled = false;
            return;
        }

        signupMessage.textContent = "Account created! Please check your email to confirm your account.";
        signupButton.disabled = false;
    } catch (error) {
        signupMessage.textContent = error.message;
        signupButton.disabled = false;
    }
};