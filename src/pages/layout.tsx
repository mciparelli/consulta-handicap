import type { PropsWithChildren } from "@kitajs/html";

interface LayoutProps extends PropsWithChildren {
  dev?: boolean;
  transitionType?: string;
}

export function Layout({ children, dev = false, transitionType }: LayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>Consulta de handicap</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Consulta de handicap" />
        <link rel="stylesheet" href="/styles.css" />
        <style>{`@view-transition { navigation: auto;${transitionType ? ` types: ${transitionType};` : ""} }
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) {
    animation: vt-fade-scale-out 0.35s ease-out both;
  }
  ::view-transition-new(root) {
    animation: vt-rise-in 0.35s ease-out both;
  }
}
@keyframes vt-fade-scale-out {
  to {
    opacity: 0;
    transform: scale(0.985);
  }
}
@keyframes vt-rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
@supports selector(html:active-view-transition-type(tarjetas)) {
  html:active-view-transition-type(tarjetas) #tarjetas-loader {
    display: flex !important;
    animation: none;
  }
}
/* Grace period: only show the loader if the wait exceeds 300ms.
   Toggling display restarts the animation, so fast (cached) navigations
   unload before it ever becomes visible. */
#tarjetas-loader {
  animation: vt-loader-in 0s 300ms both;
}
@keyframes vt-loader-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`}</style>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@v1.0.0-RC.7/bundles/datastar.js"
        ></script>
      </head>
      <body class="bg-gray-100 h-[100vh] flex flex-col">
        <Header />
        {children}
        <div
          id="tarjetas-loader"
          style="display: none"
          data-show="$navigating"
          class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80"
          role="status"
          aria-live="polite"
        >
          <div class="flex flex-col items-center gap-3 bg-white px-8 py-6 rounded-lg shadow-lg">
            <svg
              class="w-8 h-8 animate-spin text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <p class="text-lg text-gray-700">Cargando tarjetas del jugador...</p>
          </div>
        </div>
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
      data-signals="{ searchString: '', showResults: false, selectedIndex: -1, navigating: false, resultCount: 0 }"
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
            "data-on:input__debounce.250ms":
              "$selectedIndex = -1; $searchString.length >= 3 && @get('/api/find-players?searchString=' + encodeURIComponent($searchString))",
            "data-on:focus": "$showResults = true",
            "data-on:blur__debounce.200ms": "$showResults = false",
            "data-on:keydown":
              "if (evt.key === 'ArrowDown') { evt.preventDefault(); $selectedIndex = Math.min($selectedIndex + 1, $resultCount - 1); } else if (evt.key === 'ArrowUp') { evt.preventDefault(); $selectedIndex = Math.max($selectedIndex - 1, -1); } else if (evt.key === 'Enter' && $selectedIndex >= 0) { evt.preventDefault(); const items = document.querySelectorAll('#player-results a'); if (items[$selectedIndex]) items[$selectedIndex].click(); } else if (evt.key === 'Escape') { $showResults = false; }",
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
      class="fixed bottom-4 right-4 max-w-sm h-64 overflow-auto bg-gray-900 text-green-400 text-xs font-mono p-3 rounded-lg shadow-lg opacity-90 z-50"
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
