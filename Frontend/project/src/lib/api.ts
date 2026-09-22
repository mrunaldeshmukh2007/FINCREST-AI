const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";;

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

  // If access token expired, refresh it and retry once
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
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

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        localStorage.setItem("access_token", refreshData.access);
        token = refreshData.access;

        // Retry the original request with the new access token
        response = await makeRequest(token);
      }
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "API request failed"
    );
  }

  return data;
}