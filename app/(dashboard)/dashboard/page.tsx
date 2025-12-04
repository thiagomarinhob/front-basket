'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/admin/layout/header';
import { leagueService } from '@/lib/api';
import type { LeagueResponse } from '@/types';
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Link2,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { getAllLeaguesAction } from '@/actions';
import { getAllCategoriesAction } from '@/actions/category-actions';
import { getCurrentUserIdAction } from '@/actions/auth-actions';

export default function DashboardPage() {
  const [leagues, setLeagues] = useState<LeagueResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [leaguesResult] = await Promise.all([
        getAllLeaguesAction()
      ]);
      if (leaguesResult.success) {
        setLeagues(leaguesResult.data);
      } else {
        setError(leaguesResult.error || 'Erro ao carregar ligas');
      }
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total de Ligas',
      value: leagues.length,
      change: `${leagues.length} liga${leagues.length !== 1 ? 's' : ''} cadastrada${leagues.length !== 1 ? 's' : ''}`,
      icon: Trophy,
      href: '/ligas',
    },
    {
      name: 'Ligas Ativas',
      value: leagues.filter((l) => {
        const now = new Date();
        const start = new Date(l.startDate);
        const end = l.endDate ? new Date(l.endDate) : null;
        return start <= now && (!end || end >= now);
      }).length,
      change: 'em andamento',
      icon: TrendingUp,
      href: '/ligas',
    },
    {
      name: 'Próximas Liga',
      value: leagues.filter((l) => {
        const now = new Date();
        const start = new Date(l.startDate);
        return start > now;
      }).length,
      change: 'aguardando início',
      icon: Calendar,
      href: '/ligas',
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Header title="Dashboard" description="Visão geral do sistema" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        description="Visão geral do seu painel administrativo"
      />

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {stat.change}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Ligas Recentes */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ligas Recentes
          </h2>
          <Link
            href="/ligas"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Ver todas <Link2 className="h-4 w-4" />
          </Link>
        </div>

        {leagues.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Nenhuma liga cadastrada ainda.
            </p>
            <Link
              href="/ligas"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Criar primeira liga
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Início
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Fim
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leagues.slice(0, 5).map((league) => (
                    <tr
                      key={league.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/ligas/${league.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                          {league.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(league.startDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {league.endDate
                          ? new Date(league.endDate).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}