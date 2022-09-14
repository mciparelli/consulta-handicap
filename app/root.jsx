import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import PlayerChooser from "./components/player-chooser";

import tailwindCss from "./styles/app.css";

export function meta() {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: "Consulta de handicap",
    description: "consulta de handicap",
  };
}

export function links() {
  return [{
    rel: "stylesheet",
    href: tailwindCss,
  }];
}

function Document({ children }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <nav className="bg-blue-500 px-3 sm:px-6 py-4 flex items-center justify-between flex-col md:flex-row">
        <a href="/">
          <h1 className="text-white text-2xl py-2">Consulta de hándicap</h1>
        </a>
        <PlayerChooser />
      </nav>
      <Outlet />
    </Document>
  );
}
