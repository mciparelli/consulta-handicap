import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { env } from "cloudflare:workers";
import { Layout, ErrorPage } from "~/pages/layout";
import { HomePage } from "~/pages/home";
import { TarjetasPage, TarjetasNotFound, TarjetasError } from "~/pages/tarjetas";
import { SetupDbPage } from "~/pages/setup-db";
import { PlayerResults } from "~/components/player-results";
import { findPlayers, getTarjetas, getPlayer, createSchema } from "~/api";
import { cache } from "~/cache";
import type { Env } from "~/types";

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .use(html())
  .derive(() => {
    const cfEnv = env as unknown as Env;
    const isDev = cfEnv.DEV === "true" || cfEnv.DEV === "1";
    return { cfEnv, isDev };
  })
  // Home page
  .get("/", ({ set, isDev }) => {
    cache.apply(set.headers, cache.untilNextThursday());
    return (
      <Layout dev={isDev}>
        <HomePage />
      </Layout>
    );
  })
  // Tarjetas page
  .get(
    "/tarjetas/:matricula",
    async ({ params: { matricula }, query, set, cfEnv, isDev }) => {
      cache.apply(set.headers, cache.staleWhileRevalidate());

      const matriculaNum = Number(matricula);
      if (isNaN(matriculaNum)) {
        return (
          <Layout dev={isDev}>
            <TarjetasNotFound matricula={matricula} />
          </Layout>
        );
      }

      try {
        const todas = query.todas === "1" || query.todas === "true";
        const tarjetas = await getTarjetas(matriculaNum, todas);

        // Try to get player info from DB if env is available
        let player = null;
        if (cfEnv?.LIBSQL_URL) {
          try {
            player = await getPlayer(matriculaNum, { env: cfEnv });
          } catch (e) {
            console.error("Error fetching player:", e);
          }
        }

        return (
          <Layout dev={isDev}>
            <TarjetasPage
              tarjetas={tarjetas}
              fullName={player?.fullName ?? ""}
              clubName={player?.clubName ?? ""}
              handicapIndex={player?.handicapIndex ?? null}
              handicapDate={player?.handicapDate ?? null}
              matricula={matricula}
              viendoHistoricas={todas}
            />
          </Layout>
        );
      } catch (error) {
        console.error("Error loading tarjetas:", error);
        return (
          <Layout dev={isDev}>
            <TarjetasError />
          </Layout>
        );
      }
    },
    {
      params: t.Object({
        matricula: t.String(),
      }),
      query: t.Object({
        todas: t.Optional(t.String()),
      }),
    }
  )
  // API: Find players (returns HTML partial for Datastar)
  .get(
    "/api/find-players",
    async ({ query, set, cfEnv }) => {
      cache.apply(set.headers, cache.apiResponse());
      set.headers["Content-Type"] = "text/html";

      const searchString = query.searchString;
      if (!searchString || searchString.length < 3) {
        return <div id="player-results"></div>;
      }

      try {
        const context = cfEnv?.LIBSQL_URL ? { env: cfEnv } : null;
        const players = await findPlayers(searchString, context as any);
        if (!players || players.length === 0) {
          return (
            <div
              id="player-results"
              class="z-10 absolute bg-white max-h-60 mt-1 overflow-auto rounded-md shadow-lg w-full"
            >
              <div class="py-3 px-4 text-gray-500 text-sm">
                No se encontraron a ningún jugador con ese criterio
              </div>
            </div>
          );
        }

        return <PlayerResults players={players} />;
      } catch (error) {
        console.error("Error finding players:", error);
        return <div id="player-results"></div>;
      }
    },
    {
      query: t.Object({
        searchString: t.Optional(t.String()),
      }),
    }
  )
  // API: Find players (returns JSON)
  .get(
    "/api/find-players-json",
    async ({ query, set, cfEnv }) => {
      cache.apply(set.headers, cache.apiResponse());

      const searchString = query.searchString;
      if (!searchString || searchString.length < 3) {
        return [];
      }

      try {
        const context = cfEnv?.LIBSQL_URL ? { env: cfEnv } : null;
        const players = await findPlayers(searchString, context as any);
        return players ?? [];
      } catch (error) {
        console.error("Error finding players:", error);
        return [];
      }
    },
    {
      query: t.Object({
        searchString: t.Optional(t.String()),
      }),
    }
  )
  // Setup DB page (GET)
  .get("/setup-db", ({ isDev }) => {
    return (
      <Layout dev={isDev}>
        <SetupDbPage />
      </Layout>
    );
  })
  // Setup DB page (POST)
  .post("/setup-db", async ({ cfEnv, isDev }) => {
    if (!cfEnv?.LIBSQL_URL) {
      return (
        <Layout dev={isDev}>
          <SetupDbPage
            result={{
              success: false,
              message: "Database not configured (LIBSQL_URL missing)",
            }}
          />
        </Layout>
      );
    }

    try {
      await createSchema({ env: cfEnv });
      return (
        <Layout dev={isDev}>
          <SetupDbPage
            result={{
              success: true,
              message: "Database schema created successfully",
            }}
          />
        </Layout>
      );
    } catch (error) {
      console.error("Error setting up database:", error);
      return (
        <Layout dev={isDev}>
          <SetupDbPage
            result={{
              success: false,
              message: "Error creating database schema",
              error: error instanceof Error ? error.message : String(error),
            }}
          />
        </Layout>
      );
    }
  })
  // Error handler
  .onError(({ code, error, set, isDev }) => {
    console.error("Error:", code, error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return (
        <Layout dev={isDev}>
          <ErrorPage message="Página no encontrada" />
        </Layout>
      );
    }

    set.status = 500;
    return (
      <Layout dev={isDev}>
        <ErrorPage message="Hubo un error. Intente nuevamente." />
      </Layout>
    );
  })
  .compile();

export default app;
