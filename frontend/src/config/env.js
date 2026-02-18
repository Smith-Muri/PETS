// Frontend config helpers
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function getImageUrl(filename) {
  if (!filename) return null;
  const base = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3001/uploads';
  return `${base}/pets/${filename}`;
}

export const PAGINATION = {
  LIMIT: 12,
  PAGE: 1,
};

export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

export default {
  API_BASE_URL,
  getImageUrl,
  PAGINATION,
  UPLOAD,
};
