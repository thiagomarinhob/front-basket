import { notFound } from 'next/navigation';
import { Header } from '@/components/admin/layout/header';
import {
  getTeamByIdAction,
  getTeamPlayersAction,
  getTeamCategoriesAction,
} from '@/actions/team-actions';
import {
  Users,
  MapPin,
  Trophy,
  Target,
  ArrowLeft,
  User,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type {
  TeamResponse,
  ListPlayersResponse,
  ListCategoryResponse,
} from '@/types';

interface TeamDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailsPage({
  params,
}: TeamDetailsPageProps) {
  const { id } = await params;

  // Busca os dados do time
  const teamResult = await getTeamByIdAction(id);

  if (!teamResult.success || !teamResult.data) {
    notFound();
  }

  const team: TeamResponse = teamResult.data;

  // Busca dados relacionados em paralelo
  const [playersResult, categoriesResult] = await Promise.all([
    getTeamPlayersAction(id),
    getTeamCategoriesAction(id),
  ]);

  const players: ListPlayersResponse[] = playersResult.success
    ? playersResult.data
    : [];
  const categories: ListCategoryResponse[] = categoriesResult.success
    ? categoriesResult.data
    : [];

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <Link
          href="/times"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Times
        </Link>
      </div>

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <Image
            src="/images/team-placeholder.svg"
            alt={team.name}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="flex-1">
          <Header
            title={team.name}
            description={team.description || 'Detalhes do time'}
          />
        </div>
      </div>

      {/* Informações básicas do time */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Localização
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.location || '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ranking
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.ranking !== undefined && team.ranking !== null
                  ? team.ranking
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Jogadores
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {players.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categorias
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.categories?.length || categories.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categorias do Time */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Categorias
              </h2>
            </div>
          </div>
          <div className="p-6">
            {team.categories && team.categories.length > 0 ? (
              <div className="space-y-3">
                {team.categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        {category.categoryGender}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        {category.categoryGender}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhuma categoria cadastrada
              </p>
            )}
          </div>
        </div>

        {/* Jogadores do Time */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Jogadores
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            {players.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhum jogador cadastrado
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Documento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Categoria
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center">
                          {player.photoURL && (
                            <Image
                              src={player.photoURL}
                              alt={`${player.firstName} ${player.lastName}`}
                              width={32}
                              height={32}
                              className="mr-3 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {player.firstName} {player.lastName}
                            </p>
                            {player.nickName && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {player.nickName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {player.document}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {player.categoryName && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {player.categoryName}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      {team.description && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Sobre o Time
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {team.description}
          </p>
        </div>
      )}
    </div>
  );
}

