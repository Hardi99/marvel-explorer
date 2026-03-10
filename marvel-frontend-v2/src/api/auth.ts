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
  apiFetch<{ message: string }>('/user/signup', null, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data: LoginPayload) =>
  apiFetch<User>('/user/login', null, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const forgotPassword = (email: string) =>
  apiFetch<{ message: string }>('/user/forgot-password', null, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token: string, password: string) =>
  apiFetch<{ message: string }>('/user/reset-password', null, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
