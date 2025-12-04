'use server';

import { apiRequest } from './_helpers';
import type { Category, CategoryRequest, CategoryResponse } from '@/types';

/**
 * Cria uma nova categoria
 */
export async function createCategoryAction(data: CategoryRequest) {
  try {
    const category = await apiRequest<Category>('/categories', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar categoria',
    };
  }
}

/**
 * Lista todas as categorias
 */
export async function getAllCategoriesAction() {
  try {
    const categories = await apiRequest<CategoryResponse[]>('/categories', {
      method: 'GET',
      requireAuth: true,
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categorias',
      data: [],
    };
  }
}
