// Funções de autenticação (client-side)

import { loginAction, logoutAction } from '@/actions/auth-actions';

export interface Session {
  userId: string;
  email: string;
  token: string;
  expiresAt: number;
}

/**
 * Realiza o login do usuário
 * O token é salvo automaticamente nos cookies pela Server Action
 */
export async function signIn(email: string, password: string): Promise<void> {
  const result = await loginAction(email, password);
  
  if (!result.success) {
    throw new Error(result.error || 'Erro ao fazer login');
  }
}

/**
 * Realiza o logout do usuário
 * O token é removido automaticamente dos cookies pela Server Action
 */
export async function signOut(): Promise<void> {
  await logoutAction();
}

/**
 * Verifica se o usuário está autenticado (client-side)
 * Nota: A verificação real é feita no middleware usando cookies httpOnly
 * Esta função retorna null pois o token não pode ser acessado via JavaScript por segurança
 */
export function getAuthToken(): string | null {
  // O token está em um cookie httpOnly, então não pode ser acessado via JavaScript
  // A verificação de autenticação é feita no middleware
  return null;
}