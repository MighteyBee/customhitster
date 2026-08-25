console.log("account.js loaded");

const loginSection = document.getElementById("loginSection");
const accountSection = document.getElementById("accountSection");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

const accountEmail = document.getElementById("accountEmail");

const backButton = document.getElementById("backButton");


// ========================================
// Check that Supabase exists
// ========================================

console.log("Supabase client:", supabase);


// ========================================
// Check current user
// ========================================

checkUser();

async function checkUser() {

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    console.log("Current user:", user);
    console.log("getUser error:", error);

    if (user) {
        showLoggedIn(user);
    } else {
        showLoggedOut();
    }
}


// ========================================
// CREATE ACCOUNT
// ========================================

signupButton.addEventListener("click", async () => {

    console.log("Create Account clicked");

    signupMessage.textContent = "Creating account...";
    signupMessage.style.color = "white";

    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    console.log("Email:", email);
    console.log("Password length:", password.length);

    if (!email || !password) {

        signupMessage.textContent =
            "Please enter an email and password.";

        return;
    }

    const { data, error } =
        await supabase.auth.signUp({
            email: email,
            password: password
        });

    console.log("Signup data:", data);
    console.log("Signup error:", error);

    if (error) {

        signupMessage.textContent =
            "Error: " + error.message;

        signupMessage.style.color = "#EF4444";

        return;
    }

    if (data.user && !data.session) {

        signupMessage.textContent =
            "Account created! Please check your email and click the confirmation link.";

        signupMessage.style.color = "#10B981";

    } else if (data.user && data.session) {

        signupMessage.textContent =
            "Account created and logged in!";

        signupMessage.style.color = "#10B981";

        showLoggedIn(data.user);

    } else {

        signupMessage.textContent =
            "Something unexpected happened. Check the browser console.";

    }

});


// ========================================
// LOGIN
// ========================================

loginButton.addEventListener("click", async () => {

    console.log("Login clicked");

    loginMessage.textContent = "Logging in...";

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter your email and password.";

        return;
    }

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

    console.log("Login data:", data);
    console.log("Login error:", error);

    if (error) {

        loginMessage.textContent =
            "Login failed: " + error.message;

        loginMessage.style.color = "#EF4444";

        return;
    }

    loginMessage.textContent =
        "Login successful!";

    loginMessage.style.color = "#10B981";

    showLoggedIn(data.user);

});


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener("click", async () => {

    const { error } =
        await supabase.auth.signOut();

    if (error) {

        console.error(error);
        return;

    }

    showLoggedOut();

});


// ========================================
// UI
// ========================================

function showLoggedIn(user) {

    loginSection.style.display = "none";
    accountSection.style.display = "block";

    accountEmail.textContent = user.email;
}


function showLoggedOut() {

    loginSection.style.display = "block";
    accountSection.style.display = "none";

}


// ========================================
// BACK BUTTON
// ========================================

backButton.addEventListener("click", () => {

    window.location.href = "index.html";

});