// auth.js


const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const showSignupButton = document.getElementById("showSignupButton");
const showLoginButton = document.getElementById("showLoginButton");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");


if (!window.supabase) {
    console.error("Supabase client not initialized!");
    document.getElementById("signupMessage").textContent = "Error: Supabase client not initialized.";
}

// Back to menu
document.getElementById("backButton").onclick = () => {
    window.location.href = "index.html";
};

// Show signup
showSignupButton.onclick = () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    signupMessage.textContent = ""; // Clear any previous messages
};

// Show login
showLoginButton.onclick = () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    loginMessage.textContent = ""; // Clear any previous messages
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
    loginMessage.textContent = "Logging in...";

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
    signupMessage.textContent = "Creating account...";

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: "https://mighteybee.github.io/customhitster/login.html"
            }
        });

        if (error) {
            signupMessage.textContent = error.message;
            signupButton.disabled = false;
            return;
        }

        // Account created successfully
        signupMessage.textContent = "Account created! Please check your email to confirm your account.";
        signupButton.disabled = false;

        // Clear the form
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPassword").value = "";
    } catch (error) {
        signupMessage.textContent = error.message;
        signupButton.disabled = false;
    }
};