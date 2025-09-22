// API client for Security Incident Management
const API_BASE = 'http://127.0.0.1:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Get incident statistics
  async getStats() {
    return this.request('/incidents/stats');
  }

  // List incidents with optional filtering and pagination
  async getIncidents(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/incidents${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get single incident by ID
  async getIncident(id) {
    return this.request(`/incidents/${id}`);
  }

  // Get incident history/audit trail
  async getIncidentHistory(id) {
    return this.request(`/incidents/${id}/history`);
  }

  // Acknowledge incident
  async acknowledgeIncident(id, actor, note) {
    return this.request(`/incidents/${id}/ack`, {
      method: 'POST',
      body: JSON.stringify({ actor, note }),
    });
  }

  // Resolve incident
  async resolveIncident(id, actor, note) {
    return this.request(`/incidents/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ actor, note }),
    });
  }

  // Mark incident as false positive
  async markFalsePositive(id, actor, note) {
    return this.request(`/incidents/${id}/false-positive`, {
      method: 'POST',
      body: JSON.stringify({ actor, note }),
    });
  }

  // Assign incident to someone
  async assignIncident(id, actor, assignee, note) {
    return this.request(`/incidents/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ actor, assignee, note }),
    });
  }

  // Add comment to incident
  async addComment(id, actor, note) {
    return this.request(`/incidents/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ actor, note }),
    });
  }

  // Save solution for incident
  async saveSolution(id, solutionTitle, solutionContent, incidentType, actor = 'security-analyst') {
    return this.request(`/incidents/${id}/save-solution`, {
      method: 'POST',
      body: JSON.stringify({ 
        solution_title: solutionTitle,
        solution_content: solutionContent,
        incident_type: incidentType,
        actor 
      }),
    });
  }

  // Get suggested solutions for incident
  async getSuggestedSolutions(id) {
    return this.request(`/incidents/${id}/suggested-solutions`);
  }

  // Get solution by memory ID
  async getSolutionById(memoryId) {
    return this.request(`/memory/solutions/${memoryId}`);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for easier importing
export const {
  getStats,
  getIncidents,
  getIncident,
  getIncidentHistory,
  acknowledgeIncident,
  resolveIncident,
  markFalsePositive,
  assignIncident,
  addComment,
  saveSolution,
  getSuggestedSolutions,
  getSolutionById
} = apiClient;
