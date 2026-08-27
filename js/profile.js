async function loadProfile() {

    const {
        data: { user },
        error: userError
    } = await window.supabase.auth.getUser();

    if (userError || !user) {
        console.log("No logged-in user.");
          updateProfileDisplay({ username: "Guest", points: 0 });
        return null;
    }

    const { data: profile, error: profileError } =
        await window.supabase
            .from("profiles")
            .select("username, points")
            .eq("id", user.id)
            .single();

    if (profileError || !profile) {
        console.error("Could not load profile:", profileError);
        updateProfileDisplay({ username: "Player", points: 0 });
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
        element.textContent = profile.points || 0;
    });

}

async function updatePoints(newPoints) {
    const { data: { user }, error: userError } = await window.supabase.auth.getUser();

    if (userError || !user) {
        console.error("No logged-in user.");
        return false;
    }

    // Update the user's points
    const { error: updateError } = await window.supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", user.id);

    if (updateError) {
        console.error("Could not update points:", updateError);
        return false;
    }

    return true;
}