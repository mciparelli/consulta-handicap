const { installGlobals } = require("@remix-run/node");

const { createRequestHandler } = require("@remix-run/netlify");

const build = require("@remix-run/dev/server-build");

installGlobals();

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
