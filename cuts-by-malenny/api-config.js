// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : 'https://your-render-backend-url.onrender.com/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
}

// Export for use in other files
window.api = {
  // Auth
  login: (username, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  
  // Services
  getServices: () => apiCall('/services'),
  
  // Appointments
  getAvailableSlots: (date) => apiCall(`/appointments/available-slots?date=${date}`),
  bookAppointment: (data) => apiCall('/appointments/book', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Customers (admin only)
  searchCustomers: (query) => apiCall(`/customers/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  getCustomer: (id) => apiCall(`/customers/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
};
