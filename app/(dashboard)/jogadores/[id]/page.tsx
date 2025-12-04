import { notFound } from 'next/navigation';
import { Header } from '@/components/admin/layout/header';
import { getPlayerByIdAction } from '@/actions/player-actions';
import {
  User,
  IdCard,
  Calendar,
  Ruler,
  Hash,
  ArrowLeft,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { PlayerResponse } from '@/types';

interface PlayerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetailsPage({
  params,
}: PlayerDetailsPageProps) {
  const { id } = await params;

  // Busca os dados do jogador
  const playerResult = await getPlayerByIdAction(id);

  if (!playerResult.success || !playerResult.data) {
    notFound();
  }

  const player: PlayerResponse = playerResult.data;

  // Calcula a idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = player.birthDate ? calculateAge(player.birthDate) : null;
  const formattedBirthDate = player.birthDate
    ? new Date(player.birthDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <Link
          href="/jogadores"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Jogadores
        </Link>
      </div>

      <div className="flex items-start gap-4">
        {player.photoURL && (
          <div className="flex-shrink-0">
            <Image
              src={player.photoURL}
              alt={`${player.firstName} ${player.lastName}`}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
        <div className="flex-1">
          <Header
            title={`${player.firstName} ${player.lastName}`}
            description={player.nickName || 'Detalhes do jogador'}
          />
        </div>
      </div>

      {/* Informações básicas do jogador */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <IdCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Documento
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {player.document}
              </p>
            </div>
          </div>
        </div>

        {player.nickName && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <UserCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Apelido
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {player.nickName}
                </p>
              </div>
            </div>
          </div>
        )}

        {formattedBirthDate && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Data de Nascimento
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formattedBirthDate}
                </p>
                {age !== null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {age} anos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {player.height && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                <Ruler className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Altura
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {player.height}m
                </p>
              </div>
            </div>
          </div>
        )}

        {player.jerseyNumber && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <Hash className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Número da Camisa
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  #{player.jerseyNumber}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Informações Pessoais
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Nome Completo
            </p>
            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {player.firstName} {player.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ID
            </p>
            <p className="mt-1 text-base text-gray-900 dark:text-white font-mono text-sm">
              {player.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

