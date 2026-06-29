const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to standardise fetch calls
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Retrieve token from local storage
  const token = localStorage.getItem('oxygen_google_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    
    // Inspect Content-Type to prevent response.json() on HTML responses
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 150)}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Call failed on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Sync user with backend after Google Sign-In
  loginSync: (idToken) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });
  },

  // Generate a new 2-year equipment roadmap
  generateRoadmap: (formData) => {
    return apiCall('/generate', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  // Retrieve paginated and filtered generation history
  getHistory: ({ page = 1, limit = 10, sport = '', search = '', sort = 'newest' }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sport,
      search,
      sort
    });
    return apiCall(`/history?${params.toString()}`);
  },

  // Retrieve details for a specific generation
  getHistoryDetail: (id) => {
    return apiCall(`/history/${id}`);
  },

  // Soft delete a specific generation
  deleteHistory: (id) => {
    return apiCall(`/history/${id}`, {
      method: 'DELETE'
    });
  },

  // Submit feedback rating / comment
  submitFeedback: (feedbackData) => {
    return apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  },

  // Retrieve analytics data for admin panel (requires admin PIN)
  getAnalytics: (pin) => {
    return apiCall('/analytics', {
      method: 'GET',
      headers: {
        'x-admin-pin': pin
      }
    });
  },

  // Update user avatar profile picture
  updateAvatar: (avatar) => {
    return apiCall('/auth/update-avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar })
    });
  },

  // Update user Planner Mode (role)
  updateRole: (role) => {
    return apiCall('/auth/update-role', {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  // Retrieve preset templates
  getTemplates: () => {
    return apiCall('/templates');
  }
};
