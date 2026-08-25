console.log("account.js loaded");

const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupButton = document.getElementById("signupButton");
const signupMessage = document.getElementById("signupMessage");

signupButton.addEventListener("click", async () => {

    console.log("Create Account clicked");

    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (!email || !password) {
        signupMessage.textContent =
            "Please enter an email and password.";
        return;
    }

    signupMessage.textContent = "Creating account...";

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {

        console.error("Sign-up error:", error);

        signupMessage.textContent =
            "Error: " + error.message;

        return;
    }

    console.log("Account created:", data);

    signupMessage.textContent =
        "Account created! Please check your email and click the confirmation link.";

});


const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

loginButton.addEventListener("click", async () => {

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter an email and password.";
        return;
    }

    loginMessage.textContent = "Logging in...";

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Login failed: " + error.message;

        return;
    }

    console.log("Logged in:", data);

    loginMessage.textContent =
        "Login successful!";

});