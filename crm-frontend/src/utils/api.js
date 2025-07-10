const API_BASE_URL = '/api';

export const fetchAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};
