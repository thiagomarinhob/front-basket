// Funções de autenticação

import { authService } from './api';
import type { AuthUserResponse, User } from '@/types';

export interface Session {
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
}

export async function signIn(email: string, password: string): Promise<Session> {
  const response: AuthUserResponse = await authService.signIn(email, password);
  
  // Calcula quando o token expira (expires_in está em segundos)
  const expiresAt = Date.now() + response.expires_in * 1000;
  
  const session: Session = {
    userId: '', // Você pode decodificar o JWT para obter o userId
    email,
    token: response.access_token,
    expiresAt,
  };

  // Salva no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', response.access_token);
    localStorage.setItem('session', JSON.stringify(session));
  }

  return session;
}

export function signOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('session');
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth-token');
  const sessionStr = localStorage.getItem('session');
  
  if (!token || !sessionStr) return null;

  try {
    const session: Session = JSON.parse(sessionStr);
    
    // Verifica se o token expirou
    if (session.expiresAt < Date.now()) {
      signOut();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = getSession();
  return session !== null;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
}