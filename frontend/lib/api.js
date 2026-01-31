import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Templates
export const getTemplates = () => api.get('/templates');
export const getClientTemplates = (clientId) => api.get(`/clients/${clientId}/templates`);
export const getTemplate = (id) => api.get(`/templates/${id}`);
export const createTemplate = (data) => api.post('/templates', data);
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);

// Generated RSAs
export const getTemplateRSAs = (templateId) => api.get(`/templates/${templateId}/rsas`);
export const saveGeneratedRSAs = (templateId, data) => api.post(`/templates/${templateId}/rsas`, data);
export const markRSAAsExported = (id) => api.put(`/rsas/${id}/export`);

export default api;
