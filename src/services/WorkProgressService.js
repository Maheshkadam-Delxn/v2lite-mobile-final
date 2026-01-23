import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.BASE_API_URL || 'http://172.31.246.205:3000'; // Fallback for dev
const API_URL = `${BASE_URL}/api/work-progress`;

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const WorkProgressService = {
    /**
     * List Work Progress Logs
     * @param {Object} params - Query params (projectId, date, milestoneId)
     */
    getLogs: async (params = {}) => {
        try {
            const headers = await getHeaders();
            // Handle date objects if passed
            const formattedParams = { ...params };
            if (params.date instanceof Date) {
                formattedParams.date = params.date.toISOString().split('T')[0];
            }

            const queryString = new URLSearchParams(formattedParams).toString();
            const response = await fetch(`${API_URL}?${queryString}`, {
                method: 'GET',
                headers,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to fetch work logs');
            }
            return json;
        } catch (error) {
            console.error('[WorkProgressService] getLogs error:', error);
            throw error;
        }
    },

    /**
     * Create Work Progress Log
     * @param {Object} data - { projectId, milestoneId, effortPercentage, description, photos, logDate }
     */
    createLog: async (data) => {
        try {
            const headers = await getHeaders();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to create work log');
            }
            return json;
        } catch (error) {
            console.error('[WorkProgressService] createLog error:', error);
            throw error;
        }
    },

    /**
     * Get Work Progress Summary (Daily, Weekly, Monthly)
     * @param {Object} params - { projectId, type ['daily', 'weekly', 'monthly'] }
     */
    getSummary: async (params = {}) => {
        try {
            const headers = await getHeaders();
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_URL}/summary?${queryString}`, {
                method: 'GET',
                headers,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message || 'Failed to fetch summary');
            }
            return json;
        } catch (error) {
            console.error('[WorkProgressService] getSummary error:', error);
            throw error;
        }
    },

    /**
     * Helper to get color based on effort percentage
     * @param {number} percentage 
     */
    getEffortColor: (percentage) => {
        if (percentage >= 80) return '#10B981'; // Green
        if (percentage >= 50) return '#3B82F6'; // Blue
        if (percentage >= 20) return '#EAB308'; // Yellow
        return '#F97316'; // Orange
    }
};
