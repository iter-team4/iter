export function getUserInfoFromToken() {
  const token = localStorage.getItem("idToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    let displayName = "User";

    if (payload.firstName || payload.lastName) {
      displayName = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
    } else if (payload.username) {
      displayName = payload.username;
    } else if (payload.email) {
      displayName = payload.email;
    }

    return {
      name: payload.name || displayName || "User",
      email: payload.email || "",
      username: payload.username || "",
      memberSince: payload["iat"]
        ? new Date(payload["iat"] * 1000).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : payload.memberSince || "",
    };
  } catch {
    console.error("Could not decode idToken");
    return null;
  }
}