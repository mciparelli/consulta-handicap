import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import PlayerChooser from "./components/player-chooser";

import tailwindCss from "./styles/tailwind.css";

function links() {
  return [{
    rel: "stylesheet",
    href: tailwindCss,
  }];
}

function Document({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Consulta de handicap</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Consulta de handicap" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 h-[100vh] flex flex-col">
        {children}
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function App() {
  return (
    <Document>
      <nav className="bg-blue-500 px-3 sm:px-6 py-4 flex items-center justify-between flex-col md:flex-row">
        <a href="/">
          <h1 className="text-white text-2xl py-2">Consulta de hándicap</h1>
        </a>
        <PlayerChooser />
      </nav>
    </Document>
  );
}

export { links, App as default }