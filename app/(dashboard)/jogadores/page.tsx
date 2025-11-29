'use client';

import { Header } from '@/components/admin/layout/header';
import { Plus, User } from 'lucide-react';
import Link from 'next/link';

export default function JogadoresPage() {
  return (
    <div>
      <Header
        title="Jogadores"
        description="Gerencie todos os jogadores do sistema"
        action={
          <Link
            href="/jogadores/novo"
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Novo Jogador
          </Link>
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Lista de jogadores será exibida aqui.
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Use o endpoint POST /players para criar jogadores
        </p>
      </div>
    </div>
  );
}
