import type { PropsWithChildren } from "@kitajs/html";

interface LayoutProps extends PropsWithChildren {
  dev?: boolean;
}

export function Layout({ children, dev = false }: LayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>Consulta de handicap</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Consulta de handicap" />
        <link rel="stylesheet" href="/styles.css" />
        <style>{`@view-transition { navigation: auto; }`}</style>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@v1.0.0-RC.7/bundles/datastar.js"
        ></script>
      </head>
      <body class="bg-gray-100 h-[100vh] flex flex-col">
        <Header />
        {children}
        {dev && <DebugPanel />}
      </body>
    </html>
  );
}

function Header(): JSX.Element {
  return (
    <nav class="bg-blue-500 px-3 sm:px-6 py-4 flex items-center justify-between flex-col md:flex-row">
      <a href="/">
        <h1 class="text-white text-2xl py-2">Consulta de hándicap</h1>
      </a>
      <PlayerChooser />
    </nav>
  );
}

function PlayerChooser(): JSX.Element {
  return (
    <div
      class="relative w-full md:w-auto"
      data-signals="{ searchString: '', showResults: false, selectedIndex: -1 }"
    >
      <div class="flex justify-between">
        <input
          type="text"
          name="searchString"
          placeholder="Matrícula o apellido"
          class="p-3 rounded-md w-full md:w-80"
          autocomplete="off"
          {...{
            "data-bind": "searchString",
            "data-indicator:fetching": "",
            "data-on:input__debounce.250ms__viewtransition":
              "$selectedIndex = -1; $searchString.length >= 3 && @get('/api/find-players?searchString=' + encodeURIComponent($searchString))",
            "data-on:focus": "$showResults = true",
            "data-on:blur__debounce.200ms": "$showResults = false",
            "data-on:keydown":
              "if (evt.key === 'ArrowDown') { evt.preventDefault(); const items = document.querySelectorAll('#player-results a'); if (items.length > 0) $selectedIndex = Math.min($selectedIndex + 1, items.length - 1); } else if (evt.key === 'ArrowUp') { evt.preventDefault(); $selectedIndex = Math.max($selectedIndex - 1, -1); } else if (evt.key === 'Enter' && $selectedIndex >= 0) { evt.preventDefault(); const items = document.querySelectorAll('#player-results a'); if (items[$selectedIndex]) window.location.href = items[$selectedIndex].href; } else if (evt.key === 'Escape') { $showResults = false; }",
          }}
        />
        <svg
          data-show="$fetching"
          class="absolute right-2 top-0 bottom-0 my-auto w-5 h-5 animate-spin text-gray-600"
          style="display: none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div
        id="player-results"
        data-show="$showResults && !$fetching"
        style="display: none"
        class="z-10 absolute bg-white max-h-60 mt-1 overflow-auto rounded-md shadow-lg w-full"
      >
        {/* Results will be patched here by the server */}
      </div>
    </div>
  );
}

function DebugPanel(): JSX.Element {
  return (
    <div
      class="fixed bottom-4 right-4 max-w-sm max-h-64 overflow-auto bg-gray-900 text-green-400 text-xs font-mono p-3 rounded-lg shadow-lg opacity-90 z-50"
      data-signals="{ _debugOpen: true }"
    >
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold text-green-300">Signals</span>
        <button
          class="text-gray-400 hover:text-white text-sm"
          {...{
            "data-on:click": "$_debugOpen = !$_debugOpen",
          }}
        >
          <span data-show="$_debugOpen">−</span>
          <span data-show="!$_debugOpen" style="display: none">
            +
          </span>
        </button>
      </div>
      <pre data-show="$_debugOpen" data-json-signals></pre>
    </div>
  );
}

export function ErrorPage({ message }: { message: string }): JSX.Element {
  return (
    <Layout>
      <div class="m-auto text-2xl text-center">{message}</div>
    </Layout>
  );
}
