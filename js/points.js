//////////////////////////////////////////////////////
// POINTS SYSTEM
//////////////////////////////////////////////////////

async function addPoints(points) {

    if (!supabase) {
        console.error("Supabase is not available.");
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.log("No logged-in user. Points not saved.");
        return;
    }

    // Get current profile
    const { data: profile, error: profileError } =
        await supabase
            .from("profiles")
            .select("points")
            .eq("id", user.id)
            .single();

    if (profileError) {
        console.error("Could not get profile:", profileError);
        return;
    }

    const newPoints = (profile.points || 0) + points;

    // Update profile
    const { error: updateError } =
        await supabase
            .from("profiles")
            .update({
                points: newPoints
            })
            .eq("id", user.id);

    if (updateError) {
        console.error("Could not update points:", updateError);
        return;
    }

    console.log(`Added ${points} points. New total: ${newPoints}`);
}