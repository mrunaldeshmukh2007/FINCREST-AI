const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  let token = localStorage.getItem("access_token");

  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
        ...options.headers,
      },
    });
  };

  let response = await makeRequest(token);

  // If access token expired, try to refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("Session expired. Please log in again.");
    }

    const refreshResponse = await fetch(
      `${API_BASE_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!refreshResponse.ok) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Session expired. Please log in again.");
    }

    const refreshData = await refreshResponse.json();

    const newAccessToken = refreshData.access;

    if (typeof newAccessToken !== "string") {
      throw new Error("Session expired. Please log in again.");
    }

    token = newAccessToken;

    localStorage.setItem("access_token", token);

    // Retry original request with fresh token
    response = await makeRequest(token);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "API request failed"
    );
  }

  return data;
}