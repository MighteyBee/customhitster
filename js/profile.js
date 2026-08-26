async function loadProfile() {

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.log("No logged-in user.");
        return null;
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("username, points")
            .eq("id", user.id)
            .single();

    if (profileError) {
        console.error("Could not load profile:", profileError);
        return null;
    }

    updateProfileDisplay(profile);

    return profile;
}


function updateProfileDisplay(profile) {

    const usernameElements =
        document.querySelectorAll(".profileUsername");

    const pointsElements =
        document.querySelectorAll(".profilePoints");


    usernameElements.forEach(element => {
        element.textContent = profile.username || "Player";
    });


    pointsElements.forEach(element => {
        element.textContent = profile.points;
    });

}