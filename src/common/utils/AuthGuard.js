export function isLoggedIn() {
    return sessionStorage.getItem("access-token") != null;
}

export function getRole() {
    return sessionStorage.getItem("role") || null;
}

export function getAccessToken() {
    return sessionStorage.getItem("access-token");
}

export function requireRole(role, navigate) {
    if (!isLoggedIn()) {
        navigate("/login");
        return false;
    }
    if (getRole() !== role) {
        return false;
    }
    return true;
}
