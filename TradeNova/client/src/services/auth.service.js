import { request } from './api.js';

export const registerUser = (payload) => request('/api/auth/register', { method: 'POST', body: payload });
export const loginUser = (payload) => request('/api/auth/login', { method: 'POST', body: payload });
export const getProfile = (token) => request('/api/auth/profile', { method: 'GET', token });
