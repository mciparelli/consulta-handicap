import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { createRequestHandlerWithStaticFiles } from "@remix-run/deno";
// Import path interpreted by the Remix compiler
import * as build from "@remix-run/dev/server-build";

const TARGET_HOSTNAME = "consulta-handicap.mciparelli.workers.dev";

const remixHandler = createRequestHandlerWithStaticFiles({
  build,
  mode: Deno.env.get("NODE_ENV"),
  getLoadContext: () => ({}),
});

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Redirect to the new hostname if not already there
  if (
    url.hostname !== TARGET_HOSTNAME &&
    url.hostname !== "localhost" &&
    url.hostname !== "127.0.0.1"
  ) {
    url.hostname = TARGET_HOSTNAME;
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return remixHandler(request);
}

const port = Number(Deno.env.get("PORT")) || 8000;
console.log(`Listening on http://localhost:${port}`);
serve(handler, { port });
