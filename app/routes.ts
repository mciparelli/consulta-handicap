import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "routes/debug-null.js",
  ),
  route("/find-players", "routes/find-players.js"),
  route("/tarjetas/:matricula", "routes/tarjetas.$matricula.jsx"),
] satisfies RouteConfig;
