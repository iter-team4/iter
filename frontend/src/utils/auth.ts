// Inside src/utils/auth.ts on the frontend
export function getUserInfoFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    return {
      name: payload.name || payload.username || payload.email || "User",
      email: payload.email || "",
      username: payload.username || "",
      memberSince: payload.memberSince || "",
    };
  } catch (error) {
    return null;
  }
}