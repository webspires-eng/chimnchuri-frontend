
const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.chimnchurri.com";

export async function apiClient(url, options = {}, _retried = false) {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
        ? `${BACKEND_URL}/api/v1/frontend`
        : `/api/v1/frontend`;
    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (response.status === 401 && !_retried) {
        // Try to refresh token (only once)
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            // Retry original request after refresh
            return apiClient(url, options, true);
        }

        // If refresh also fails, user must login again
        throw new Error("Session expired");
    }

    if (response.status === 401) {
        throw new Error("Session expired");
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API Error");
    }
    return response.json();

}

// Helper function to refresh access token
async function refreshAccessToken() {
    try {
        const res = await fetch(
            `/api/v1/frontend/refresh`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return res.ok;
    } catch (error) {
        return false;
    }
}