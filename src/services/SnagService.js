import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.BASE_API_URL || 'http://10.126.190.174:3000'; // Fallback for dev
const API_URL = `${BASE_URL}/api/snags`;

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Valid Enums
export const SNAG_CATEGORIES = ['civil', 'electrical', 'plumbing', 'finishing', 'other'];
export const SNAG_SEVERITIES = ['low', 'medium', 'high', 'critical'];
export const SNAG_STATUSES = ['open', 'assigned', 'fixed', 'verified', 'closed'];

export const SnagService = {
    /**
     * List Snags
     * @param {Object} params - Query params (projectId, milestoneId, status, assignedTo)
     */
    getSnags: async (params = {}) => {
        try {
            const headers = await getHeaders();
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_URL}?${queryString}`, {
                method: 'GET',
                headers,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to fetch snags');
            }
            return json;
        } catch (error) {
            console.error('[SnagService] getSnags error:', error);
            throw error;
        }
    },

    /**
     * Create Snag (Report Issue)
     * @param {Object} data - { projectId, milestoneId, title, description, category, location, severity, photos }
     */
    createSnag: async (data) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to create snag');
            }
            return json;
        } catch (error) {
            console.error('[SnagService] createSnag error:', error);
            throw error;
        }
    },

    /**
     * Get Snag Details
     * @param {string} id - Snag ID
     */
    getSnagDetails: async (id) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to fetch snag details');
            }
            return json;
        } catch (error) {
            console.error('[SnagService] getSnagDetails error:', error);
            throw error;
        }
    },

    /**
     * Update Snag / Change Status
     * @param {string} id - Snag ID
     * @param {Object} data - Fields to update (status, assignedTo, resolutionPhotos, etc.)
     */
    updateSnag: async (id, data) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(data),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to update snag');
            }
            return json;
        } catch (error) {
            console.error('[SnagService] updateSnag error:', error);
            throw error;
        }
    },

    /**
     * Helper to determine status color
     */
    getStatusColor: (status) => {
        switch (status) {
            case 'open': return '#6B7280'; // Grey (or Red as per req, let's stick to req but check UI consistency)
            // Req says: open (Grey/Red) - Let's use Red for critical/high open, or just a distinct color.
            // Re-reading req: "open (Grey/Red)". usage: Grey usually for open/pending, Red for alert. 
            // Let's use a standard color set for now.
            case 'assigned': return '#3B82F6'; // Blue
            case 'fixed': return '#EAB308'; // Yellow
            case 'verified': return '#10B981'; // Green
            case 'closed': return '#374151'; // Dark
            default: return '#9CA3AF';
        }
    },

    /**
     * Helper to determine severity color
     */
    getSeverityColor: (severity) => {
        switch (severity) {
            case 'low': return '#10B981'; // Green
            case 'medium': return '#EAB308'; // Yellow
            case 'high': return '#F97316'; // Orange
            case 'critical': return '#EF4444'; // Red
            default: return '#9CA3AF';
        }
    }
};
