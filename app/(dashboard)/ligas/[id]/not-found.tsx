import Link from 'next/link';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function LeagueNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Trophy className="h-16 w-16 text-gray-400" />
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Liga não encontrada
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        A liga que você está procurando não existe ou foi removida.
      </p>
      <Link
        href="/ligas"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Ligas
      </Link>
    </div>
  );
}

