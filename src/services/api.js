import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.hash.startsWith('#/admin')) {
        window.location.hash = '#/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/login', { email, password });
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

// Projects
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const reorderProjects = (ids) => api.post('/projects/reorder', { ids });
export const uploadProjectImage = (formData) =>
  api.post('/projects/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Get Cloudinary signature from backend
const getCloudinarySignature = (folder) =>
  api.get('/cloudinary-signature', { params: { folder } });

// Server-side upload fallback (for local dev or when Cloudinary direct fails)
const serverUpload = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/upload-file', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600000, // 10 min timeout for large files
  });
};

// Upload file: tries direct Cloudinary upload first, falls back to server-side
export const uploadFile = async (file) => {
  const isVideo = file.type.startsWith('video/');
  const folder = isVideo ? 'projects/videos' : 'projects/images';

  try {
    // 1. Get signature from our backend
    const { data: sig } = await getCloudinarySignature(folder);

    // If cloud_name looks like a placeholder, skip direct upload
    if (!sig.cloud_name || sig.cloud_name === 'CLOUD_NAME') {
      throw new Error('Cloudinary not properly configured');
    }

    // 2. Upload directly to Cloudinary
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sig.api_key);
    fd.append('timestamp', sig.timestamp);
    fd.append('signature', sig.signature);
    fd.append('folder', sig.folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: fd,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Cloudinary upload failed');
    }

    const result = await response.json();

    return {
      data: {
        url: result.secure_url,
        type: isVideo ? 'video' : 'image',
        name: file.name,
      },
    };
  } catch {
    // Fallback: upload through the server (works for local dev)
    return serverUpload(file);
  }
};

// Experiences
export const getExperiences = () => api.get('/experiences');
export const getExperience = (id) => api.get(`/experiences/${id}`);
export const createExperience = (data) => api.post('/experiences', data);
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experiences/${id}`);
export const reorderExperiences = (ids) => api.post('/experiences/reorder', { ids });

// Services
export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
export const reorderServices = (ids) => api.post('/services/reorder', { ids });

// Skills
export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
export const reorderSkills = (ids) => api.post('/skills/reorder', { ids });

// Contact Links
export const getContactLinks = () => api.get('/contact-links');
export const createContactLink = (data) => api.post('/contact-links', data);
export const updateContactLink = (id, data) => api.put(`/contact-links/${id}`, data);
export const deleteContactLink = (id) => api.delete(`/contact-links/${id}`);
export const reorderContactLinks = (ids) => api.post('/contact-links/reorder', { ids });

// Page Views
export const trackPageView = (page) => api.post('/page-views', { page });
export const getPageViewStats = () => api.get('/page-views/stats');

// Contact Messages
export const submitContactMessage = (data) => api.post('/contact-messages', data);
export const getContactMessages = () => api.get('/contact-messages');
export const getRecentMessages = (limit = 5) => api.get(`/contact-messages?limit=${limit}`);
export const getUnreadMessageCount = () => api.get('/contact-messages/unread-count');
export const markMessageRead = (id) => api.put(`/contact-messages/${id}/read`);
export const deleteContactMessage = (id) => api.delete(`/contact-messages/${id}`);

// Settings / Sections
export const getVisibleSections = () => api.get('/settings/visible-sections');
export const getSections = () => api.get('/settings/sections');
export const updateSections = (visibleSections) => api.put('/settings/sections', { visible_sections: visibleSections });

// Hero Content
export const getHeroContent = () => api.get('/settings/hero');
export const updateHeroContent = (data) => api.put('/settings/hero', data);
export const uploadHeroImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/settings/hero/upload-image', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
