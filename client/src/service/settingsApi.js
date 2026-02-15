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
        if (!response.ok) throw new Error('Error al obtener configuración');
        return await response.json();
    } catch (error) {
        console.error("getSettings error:", error);
        throw error;
    }
};
