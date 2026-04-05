const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function parseJsonSafely(text) {
    try {
        return text ? JSON.parse(text) : {};
    } catch {
        throw new Error("Réponse API invalide");
    }
}

function getStorage() {
    return localStorage;
}

function getStoredAuth() {
    const storage = getStorage();

    let user = null;
    const rawUser = storage.getItem("user");

    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
        user = null;
    }

    return {
        accessToken: storage.getItem("access_token"),
        refreshToken: storage.getItem("refresh_token"),
        accessExpiresAt: storage.getItem("access_expires_at"),
        refreshExpiresAt: storage.getItem("refresh_expires_at"),
        user
    };
}

function storeAuth(data) {
    const storage = getStorage();

    if (data.access_token) {
        storage.setItem("access_token", data.access_token);
    }

    if (data.refresh_token) {
        storage.setItem("refresh_token", data.refresh_token);
    }

    if (data.access_expires_at) {
        storage.setItem("access_expires_at", data.access_expires_at);
    }

    if (data.refresh_expires_at) {
        storage.setItem("refresh_expires_at", data.refresh_expires_at);
    }

    if (data.user) {
        storage.setItem("user", JSON.stringify(data.user));
    }
}

export function clearAuth() {
    const storage = getStorage();

    storage.removeItem("access_token");
    storage.removeItem("refresh_token");
    storage.removeItem("access_expires_at");
    storage.removeItem("refresh_expires_at");
    storage.removeItem("user");
}

export function getCurrentUser() {
    return getStoredAuth().user;
}

export function isAuthenticated() {
    return !!getStoredAuth().accessToken;
}

export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const text = await response.text();
    const data = parseJsonSafely(text);

    if (!response.ok) {
        throw new Error(data.detail || "Erreur de connexion");
    }

    storeAuth(data);
    return data;
}

export async function refreshTokens() {
    const { refreshToken } = getStoredAuth();

    if (!refreshToken) {
        clearAuth();
        throw new Error("Refresh token absent");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    });

    const text = await response.text();
    const data = parseJsonSafely(text);

    if (!response.ok) {
        clearAuth();
        throw new Error(data.detail || "Session expirée");
    }

    storeAuth(data);
    return data;
}

export async function logoutRequest() {
    const { refreshToken } = getStoredAuth();

    try {
        if (refreshToken) {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });

            if (!response.ok && response.status !== 204) {
                const text = await response.text();
                const data = text ? parseJsonSafely(text) : {};
                throw new Error(data.detail || "Erreur de déconnexion");
            }
        }
    } finally {
        clearAuth();
    }
}

let refreshPromise = null;

export async function authenticatedFetch(path, options = {}, retry = true) {
    const { accessToken } = getStoredAuth();

    if (!accessToken) {
        throw new Error("Session absente");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (response.status === 401 && retry) {
        if (!refreshPromise) {
            refreshPromise = refreshTokens().finally(() => {
                refreshPromise = null;
            });
        }

        await refreshPromise;
        return authenticatedFetch(path, options, false);
    }

    return response;
}

export async function getMangas({ page = 1, pageSize = 20, search = "" } = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize)
    });

    if (search) {
        params.append("search", search);
    }

    const response = await authenticatedFetch(`/mangas?${params.toString()}`);
    const text = await response.text();
    const data = parseJsonSafely(text);

    if (!response.ok) {
        throw new Error(data.detail || "Erreur de chargement des mangas");
    }

    return data;
}

export async function createManga(formData) {
    const image = formData.get("image");
    const title = formData.get("title");
    const price = formData.get("price");

    const hasValidImage =
        image &&
        typeof image === "object" &&
        "name" in image &&
        "size" in image &&
        image.name &&
        image.size > 0;

    if (!hasValidImage) {
        throw new Error("Image obligatoire");
    }

    if (!title || !String(title).trim()) {
        throw new Error("Titre obligatoire");
    }

    if (!price || !String(price).trim()) {
        throw new Error("Prix obligatoire");
    }

    const response = await authenticatedFetch("/mangas", {
        method: "POST",
        body: formData
    });

    const text = await response.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = {};
    }

    if (!response.ok) {
        if (Array.isArray(data.detail)) {
            throw new Error(
                data.detail
                    .map((item) => `${item.loc?.join(".") || "champ"}: ${item.msg}`)
                    .join(" | ")
            );
        }

        throw new Error(data.detail || `Erreur d'upload (${response.status})`);
    }

    return data;
}

export async function getMangaImageBlob(mangaId) {
    const response = await authenticatedFetch(`/mangas/${mangaId}/image`, {
        headers: {
            Accept: "image/*"
        }
    });

    if (!response.ok) {
        throw new Error("Erreur de chargement image");
    }

    return response.blob();
}