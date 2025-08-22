import { createRequestHandler } from "react-router";
import { createApi } from "~/api";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      api: await createApi(env, ctx),
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
