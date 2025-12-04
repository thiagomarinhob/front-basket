'use server';

import { apiRequest } from './_helpers';
import type { User, CreateUserRequest } from '@/types';

/**
 * Cria um novo usuário
 */
export async function createUserAction(data: CreateUserRequest) {
  try {
    const user = await apiRequest<User>('/users', {
      method: 'POST',
      body: data,
      requireAuth: false, // Criação de usuário não requer autenticação
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar usuário',
    };
  }
}

