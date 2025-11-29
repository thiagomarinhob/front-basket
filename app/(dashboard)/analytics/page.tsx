import { Header } from '@/components/admin/layout/header';

export default function AnalyticsPage() {
  return (
    <div>
      <Header
        title="Analytics"
        description="Relatórios e análises detalhadas"
      />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gráficos e análises serão exibidos aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
