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


// ================================
// Check current login
// ================================

checkUser();

async function checkUser() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (user) {
        showLoggedIn(user);
    } else {
        showLoggedOut();
    }
}


// ================================
// Create account
// ================================

signupButton.addEventListener("click", async () => {

    const email = signupEmail.value.trim();
    const password = signupPassword.value;

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

    if (error) {

        signupMessage.textContent =
            error.message;

        return;
    }

    signupMessage.textContent =
        "Account created! Check your email to confirm your account.";

});


// ================================
// Log in
// ================================

loginButton.addEventListener("click", async () => {

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

    if (error) {

        loginMessage.textContent =
            "Login failed: " + error.message;

        return;
    }

    showLoggedIn(data.user);

});


// ================================
// Log out
// ================================

logoutButton.addEventListener("click", async () => {

    const { error } =
        await supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    showLoggedOut();

});


// ================================
// UI
// ================================

function showLoggedIn(user) {

    loginSection.style.display = "none";
    accountSection.style.display = "block";

    accountEmail.textContent =
        user.email;
}


function showLoggedOut() {

    loginSection.style.display = "block";
    accountSection.style.display = "none";

}


// ================================
// Back button
// ================================

backButton.addEventListener("click", () => {

    window.location.href = "index.html";

});