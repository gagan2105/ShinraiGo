/**
 * Simple API utility to handle base URLs in different environments.
 * Default to localhost:3000 if no environment variable is provided.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

// Export standard endpoints if needed
export const ENDPOINTS = {
    SYNC: `${API_BASE_URL}/api/auth/sync`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LIVE_FEED: `${API_BASE_URL}/api/feed/live`,
    PANIC_ALERT: `${API_BASE_URL}/api/alerts/panic`,
    DIGITAL_ID_MINT: `${API_BASE_URL}/api/digital-id/mint`,
    DIGITAL_ID_ALL: `${API_BASE_URL}/api/digital-id/all`,
    PROFILE_UPDATE: `${API_BASE_URL}/api/auth/profile`,
};
