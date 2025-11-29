export default function ForgotPasswordPage() {
  return (
    <div className="w-full space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recuperar Senha
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enviar instruções
        </button>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Voltar para login
          </a>
        </div>
      </form>
    </div>
  );
}
