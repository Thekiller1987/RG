export const updateSettings = async (token, settingsData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settingsData)
        });
        if (!response.ok) throw new Error('Error al actualizar configuración');
        return await response.json();
    } catch (error) {
        console.error("updateSettings error:", error);
        throw error;
    }
};

export const getSettings = async (token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            // If 404 or 500, don't try to parse html
            const text = await response.text();
            console.warn("Settings API Error:", response.status, text.substring(0, 100));
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            // Probably HTML (404 handled by React Router on server)
            console.warn("Settings API returned non-JSON:", contentType);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("getSettings error:", error);
        return null; // Return null instead of throwing to prevent app crash
    }
};
