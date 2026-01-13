interface SetupDbPageProps {
  result?: {
    success: boolean;
    message: string;
    error?: string;
  };
}

export function SetupDbPage({ result }: SetupDbPageProps): JSX.Element {
  return (
    <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 class="text-2xl font-bold mb-6">Database Setup</h1>

      {result && (
        <div
          class={`p-4 mb-4 rounded-md ${
            result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {result.message}
          {result.error && <p class="text-sm mt-2 font-mono">{result.error}</p>}
        </div>
      )}

      <form method="post" action="/setup-db" class="space-y-4">
        <div class="pt-2">
          <button
            type="submit"
            class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Initialize Database Schema
          </button>
        </div>
      </form>

      <div class="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 class="text-lg font-medium mb-2">What This Does:</h2>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>
            Creates the <code>jugadores</code> table
          </li>
          <li>
            Creates the <code>handicap</code> table
          </li>
          <li>Sets up appropriate indexes and constraints</li>
        </ul>
        <p class="mt-4 text-sm text-gray-500">
          This operation is idempotent and can be safely run multiple times.
        </p>
      </div>
    </div>
  );
}
