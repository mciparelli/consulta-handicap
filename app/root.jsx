import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useTransition,
  useLoaderData,
  json,
} from "remix";
import { Box, LinearProgress, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "~/components/appbar";
import PlayerChooser from "~/components/player-chooser";
import { findPlayersFromVista } from "~/api";
import { daysToSeconds } from "~/utils";

import globalStylesUrl from "~/styles/global.css";

export function meta() {
  return {
    title: "Consulta handicap",
  };
}

// https://remix.run/api/app#links
export let links = () => {
  return [{ rel: "stylesheet", href: globalStylesUrl }];
};

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("searchString");
  if (!query) return null;
  const players = await findPlayersFromVista(query);
  return json(players);
}

function Layout({ loading, players, children }) {
  return (
    <div id="app-container">
      <AppBar>
        <PlayerChooser loading={loading} players={players} />
      </AppBar>
      {children}
    </div>
  );
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const players = useLoaderData();
  const transition = useTransition();
  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiHidden: {
        defaultProps: {
          implementation: 'css'
        }
      }
    },
  });
  return (
    <Document>
      <ThemeProvider theme={theme}>
        <Layout loading={transition.state === "loading"} players={players}>
          <Outlet />
        </Layout>
      </ThemeProvider>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="consulta de handicap" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
