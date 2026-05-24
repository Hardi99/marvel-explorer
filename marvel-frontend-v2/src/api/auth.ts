import { apiFetch } from './client';
import type { User } from '../types';

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signup = (data: SignupPayload) =>
  apiFetch<{ message: string }>('/user/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data: LoginPayload) =>
  apiFetch<User>('/user/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const logout = () =>
  apiFetch<{ message: string }>('/user/logout', { method: 'POST' });

export const forgotPassword = (email: string) =>
  apiFetch<{ message: string }>('/user/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token: string, password: string) =>
  apiFetch<{ message: string }>('/user/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
