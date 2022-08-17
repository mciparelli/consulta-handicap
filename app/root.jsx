import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import { json } from '@remix-run/node';
import AppBar from "~/components/appbar";
import Theme from "~/components/theme";
import { findPlayersFromVista } from "~/api";

import globalStylesUrl from "~/styles/global.css";

export function meta() {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: "Consulta de handicap",
    description: 'consulta de handicap'
  };
}

export function links() {
  return [{ rel: "stylesheet", href: globalStylesUrl }];
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("searchString");
  if (!query) return null;
  const players = await findPlayersFromVista(query);
  return json(players);
}

export default function App() {
  return (
    <Document>
      <div id="app-container">
        <AppBar />
        <Outlet />
      </div>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Theme>
          {children}
        </Theme>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
