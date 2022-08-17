var __create = Object.create;
var __defProp = Object.defineProperty, __defProps = Object.defineProperties, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __getOwnPropDescs = Object.getOwnPropertyDescriptors, __getOwnPropNames = Object.getOwnPropertyNames, __getOwnPropSymbols = Object.getOwnPropertySymbols, __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty, __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value, __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b))
      __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  return a;
}, __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b)), __markAsModule = (target) => __defProp(target, "__esModule", { value: !0 });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 == "object" || typeof module2 == "function")
    for (let key of __getOwnPropNames(module2))
      !__hasOwnProp.call(target, key) && (copyDefault || key !== "default") && __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  return target;
}, __toESM = (module2, isNodeMode) => __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: !0 } : { value: module2, enumerable: !0 })), module2), __toCommonJS = /* @__PURE__ */ ((cache) => (module2, temp) => cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp))(typeof WeakMap != "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});

// node_modules/@remix-run/dev/dist/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = require("react-dom/server"), import_react = require("@remix-run/react");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_react5 = require("@remix-run/react"), import_node = require("@remix-run/node");

// app/components/appbar.js
var import_material2 = require("@mui/material"), import_styles = require("@mui/material/styles"), import_react4 = require("@remix-run/react");

// app/components/player-chooser.js
var import_react2 = __toESM(require("react")), import_material = require("@mui/material"), import_use_debounce = require("use-debounce"), import_react3 = require("@remix-run/react");
function PlayerChooser() {
  let navigate = (0, import_react3.useNavigate)(), submit = (0, import_react3.useSubmit)(), players = (0, import_react3.useLoaderData)(), loading = (0, import_react3.useTransition)().state === "submitting", onChange = (0, import_use_debounce.useDebouncedCallback)((ev) => {
    ev.target.value.length < 3 || submit(ev.target.form);
  }, 250);
  return /* @__PURE__ */ import_react2.default.createElement(import_material.Box, {
    sx: { width: { xs: "100%", sm: 450 } },
    clone: !0
  }, /* @__PURE__ */ import_react2.default.createElement(import_react3.Form, {
    method: "get",
    action: "?",
    onChange
  }, /* @__PURE__ */ import_react2.default.createElement(import_material.Autocomplete, {
    sx: {
      "& .MuiAutocomplete-inputRoot": { backgroundColor: "common.white" }
    },
    id: "get-players",
    noOptionsText: (players == null ? void 0 : players.length) === 0 ? "No se encontraron jugadores" : "Ingrese matr\xEDcula o apellido",
    loadingText: "Buscando jugadores...",
    openText: "Ver jugadores",
    popupIcon: null,
    getOptionLabel: ({ fullName }) => fullName,
    filterOptions: (options) => options,
    onChange: (ev, player) => {
      player && navigate(`/tarjetas/${player.matricula}`);
    },
    renderOption: (props, { matricula, fullName, club, handicapIndex }) => /* @__PURE__ */ import_react2.default.createElement(import_material.Tooltip, __spreadValues({
      key: matricula,
      title: /* @__PURE__ */ import_react2.default.createElement(import_material.Typography, {
        component: "div"
      }, /* @__PURE__ */ import_react2.default.createElement("div", null, "H\xE1ndicap: ", handicapIndex), /* @__PURE__ */ import_react2.default.createElement("div", null, "Club: ", club))
    }, props), /* @__PURE__ */ import_react2.default.createElement(import_react3.Link, {
      prefetch: "intent",
      reloadDocument: !0,
      to: `/tarjetas/${matricula}`
    }, /* @__PURE__ */ import_react2.default.createElement(import_material.Typography, {
      noWrap: !0
    }, fullName, " (", handicapIndex, ")"))),
    options: players ?? [],
    loading,
    clearOnBlur: !1,
    renderInput: (params) => /* @__PURE__ */ import_react2.default.createElement(import_material.TextField, __spreadProps(__spreadValues({}, params), {
      name: "searchString",
      placeholder: "Matr\xEDcula o apellido",
      variant: "outlined",
      inputProps: __spreadProps(__spreadValues({}, params.inputProps), {
        pattern: ".{3,}",
        required: !0,
        title: "Dos o m\xE1s caracteres"
      }),
      InputProps: __spreadProps(__spreadValues({}, params.InputProps), {
        endAdornment: /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, loading ? /* @__PURE__ */ import_react2.default.createElement(import_material.CircularProgress, {
          color: "inherit",
          size: 20
        }) : null, params.InputProps.endAdornment)
      })
    }))
  })));
}

// app/components/appbar.js
function AppBar() {
  let theme2 = (0, import_styles.useTheme)(), isMobile = (0, import_material2.useMediaQuery)(() => theme2.breakpoints.down("xs"));
  return /* @__PURE__ */ React.createElement(import_material2.AppBar, {
    position: "static",
    sx: { position: "sticky", top: 0, zIndex: 3 }
  }, /* @__PURE__ */ React.createElement(import_material2.Toolbar, {
    sx: { py: 2 }
  }, /* @__PURE__ */ React.createElement(import_material2.Box, {
    flexDirection: { xs: "column", sm: "row" },
    sx: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /* @__PURE__ */ React.createElement(import_material2.Typography, {
    component: import_react4.Link,
    sx: { py: 1 },
    variant: "h5",
    to: "/"
  }, "Consulta de H\xE1ndicap"), /* @__PURE__ */ React.createElement(PlayerChooser, null))));
}

// app/components/theme.js
var import_styles2 = require("@mui/material/styles"), theme = (0, import_styles2.createTheme)({
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600
        }
      }
    },
    MuiHidden: {
      defaultProps: {
        implementation: "css"
      }
    }
  }
});
function Theme({ children }) {
  return /* @__PURE__ */ React.createElement(import_styles2.ThemeProvider, {
    theme
  }, children);
}

// app/cache.js
var import_redis = require("redis");
global.client || (global.client = (0, import_redis.createClient)({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}), global.client.connect());
var json = {
  get: async (key) => {
    let unparsedValue = await client.get(key);
    return JSON.parse(unparsedValue);
  },
  set: (key, value) => client.set(key, JSON.stringify(value)),
  setex: (key, expSeconds, value) => client.setEx(key, expSeconds, JSON.stringify(value))
}, cache_default = { json, db: global.client };

// app/utils.js
function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return alpha ? "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")" : "rgb(" + r + ", " + g + ", " + b + ")";
}
function daysToSeconds(days) {
  return 60 * 60 * 24 * days;
}
function yearsToSeconds(years) {
  return daysToSeconds(years * 365);
}

// app/api/aag.js
var baseUrl = "https://www.aag.org.ar/cake/Usuarios/getTarjetas";
function getSelectedIds(tarjetas) {
  let all9Holes = tarjetas.filter((tarjeta) => tarjeta.is9Holes).sort((a, b) => a.diferencial - b.diferencial), selected9Holes = [];
  for (let i = 0; i < all9Holes.length; i += 2)
    all9Holes[i + 1] && (selected9Holes = [
      ...selected9Holes,
      {
        ids: [all9Holes[i], all9Holes[i + 1]],
        is9: !0,
        diferencial: all9Holes[i].diferencial + all9Holes[i + 1].diferencial
      }
    ]);
  let tarjetas18Holes = tarjetas.filter((tarjeta) => !tarjeta.is9Holes);
  return [...selected9Holes, ...tarjetas18Holes].sort((a, b) => a.diferencial - b.diferencial).map((t) => t.is9 ? t.ids : t.id).flat().slice(0, 8);
}
async function getTarjetas(matricula) {
  let cacheKey = `hcp:tarjetas:${matricula}`, cacheValue = await cache_default.json.get(cacheKey);
  if (cacheValue)
    return cacheValue;
  let allTarjetas = (await (await fetch(`${baseUrl}/${matricula}`)).json()).map((tarjeta) => {
    let [clubId, clubName] = tarjeta.NombreClub.split(" - "), slopeRating = tarjeta.SlopeRating, adjustedScore = tarjeta.ScoreAjustado, courseRating = tarjeta.CourseRating, PCC = tarjeta.PCC, diferencial = tarjeta.Diferencial, date = new Date(tarjeta.FechaTorneo), formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return {
      id: `${clubId}-${formattedDate}-${diferencial}`,
      isoDate: date.toISOString(),
      formattedDate,
      clubId,
      clubName,
      diferencial,
      score: tarjeta.Score,
      PCC,
      adjustedScore,
      courseRating,
      slopeRating,
      is9Holes: tarjeta.TipoTarjeta === "9",
      processed: tarjeta.Procesado
    };
  }), [processed, unprocessed] = [[], []];
  for (let tarjeta of allTarjetas)
    tarjeta.processed ? processed.push(tarjeta) : unprocessed.push(tarjeta);
  let last20Tarjetas = processed.slice(0, 20), selectedIds = getSelectedIds(last20Tarjetas);
  last20Tarjetas = last20Tarjetas.map((tarjeta) => __spreadProps(__spreadValues({}, tarjeta), {
    selected: selectedIds.includes(tarjeta.id)
  }));
  let tarjetas = [...unprocessed, ...last20Tarjetas];
  return await cache_default.json.setex(cacheKey, daysToSeconds(0.4), tarjetas), tarjetas;
}

// app/api/db.js
var threeMonthsAgoDate = new Date();
threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - 3);
var threeMonthsAgoMs = threeMonthsAgoDate.getTime(), todayMs = new Date().getTime();
async function saveHistorico(matricula, handicapIndex) {
  let lastThurs = new Date();
  for (; lastThurs.getDay() !== 4; )
    lastThurs.setDate(lastThurs.getDate() - 1);
  lastThurs.setUTCHours(0, 0, 0, 0);
  let lastThursMs = lastThurs.getTime(), setKey = `hcp:historic:${matricula}`, value = `${handicapIndex}:${lastThursMs}`;
  return await cache_default.db.ZSCORE(setKey, value) ? null : cache_default.db.ZADD(setKey, {
    score: lastThursMs,
    value
  });
}
async function getHistorico(matricula) {
  return (await cache_default.db.ZRANGEBYSCORE(`hcp:historic:${matricula}`, threeMonthsAgoMs, todayMs)).map((value) => {
    let [handicapIndex, dateMs] = value.split(":").map(Number);
    return { handicapIndex, dateMs };
  });
}

// app/api/vista.js
var import_cheerio = __toESM(require("cheerio"));
async function savePlayersFound(players) {
  for (let player of players)
    await saveHistorico(player.matricula, player.handicapIndex);
}
async function findPlayersFromVista(searchString) {
  if (searchString.length < 3)
    return [];
  let cacheKey = `hcp:search:${searchString}`, cacheValue = await cache_default.json.get(cacheKey);
  if (cacheValue)
    return cacheValue;
  let url = "http://www.vistagolf.com.ar/handicap/FiltroArg.asp", isOnlyNumbers = /^\d+$/.test(searchString), params = new URLSearchParams(), paramKey = isOnlyNumbers ? "TxtNroMatricula" : "TxtApellido";
  params.append(paramKey, searchString);
  let buffer = await (await fetch(url, { method: "POST", body: params })).arrayBuffer(), result = new TextDecoder("ISO-8859-1").decode(buffer), $ = import_cheerio.default.load(result), players = $("#table19 tr").slice(2).map((index, element) => {
    let [matricula, fullName, handicapIndex, club] = $("td", element).map((index2, el) => $(el).text().trim()).get();
    return {
      matricula,
      fullName,
      handicapIndex: handicapIndex.replace(",", "."),
      club
    };
  }).get();
  return savePlayersFound(players), cache_default.json.setex(cacheKey, daysToSeconds(0.4), players), players;
}

// app/styles/global.css
var global_default = "/build/_assets/global-BW6DFXI5.css";

// app/root.jsx
function meta() {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: "Consulta de handicap",
    description: "consulta de handicap"
  };
}
function links() {
  return [{ rel: "stylesheet", href: global_default }];
}
async function loader({ request }) {
  let query = new URL(request.url).searchParams.get("searchString");
  if (!query)
    return null;
  let players = await findPlayersFromVista(query);
  return (0, import_node.json)(players);
}
function App() {
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement("div", {
    id: "app-container"
  }, /* @__PURE__ */ React.createElement(AppBar, null), /* @__PURE__ */ React.createElement(import_react5.Outlet, null)));
}
function Document({ children, title }) {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react5.Meta, null), /* @__PURE__ */ React.createElement(import_react5.Links, null)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(Theme, null, children), /* @__PURE__ */ React.createElement(import_react5.Scripts, null), /* @__PURE__ */ React.createElement(import_react5.LiveReload, null)));
}

// app/routes/tarjetas/$matricula.jsx
var matricula_exports = {};
__export(matricula_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => Tarjetas,
  loader: () => loader2,
  unstable_shouldReload: () => unstable_shouldReload
});
var import_node2 = require("@remix-run/node"), import_react6 = require("@remix-run/react"), import_tiny_invariant = __toESM(require("tiny-invariant")), import_react7 = __toESM(require("react")), import_material4 = require("@mui/material"), import_Info = __toESM(require("@mui/icons-material/Info")), import_styles3 = require("@mui/material/styles");

// app/components/chart.jsx
var import_line = require("@nivo/line"), import_material3 = require("@mui/material");
function Chart({ data }) {
  let handicaps = data.map((v) => v.y);
  return /* @__PURE__ */ React.createElement(import_material3.Box, {
    height: 400,
    my: 4,
    bgcolor: "white",
    borderRadius: 2
  }, /* @__PURE__ */ React.createElement(import_line.ResponsiveLine, {
    data: [{ id: "historico", data }],
    margin: { top: 30, right: 50, bottom: 50, left: 80 },
    xScale: {
      type: "time",
      format: "%Q"
    },
    xFormat: "time:%Q",
    yScale: {
      type: "linear",
      min: handicaps.reduce((acc, v) => Math.min(acc, v)) - 0.2,
      max: handicaps.reduce((acc, v) => Math.max(acc, v)) + 0.2
    },
    theme: {
      axis: { legend: { text: { fontSize: 16, fontWeight: 600 } } }
    },
    axisLeft: {
      legend: "H\xE1ndicap",
      legendOffset: -58,
      legendPosition: "middle",
      tickSize: 5,
      tickPadding: 12
    },
    colors: { scheme: "category10" },
    axisBottom: {
      format: "%d-%m",
      tickValues: "every 7 days",
      tickPadding: 12
    },
    layers: ["grid", "axes", "points", "lines"],
    pointSize: 16,
    pointLabelYOffset: -15,
    enablePointLabel: !0
  }));
}

// app/routes/tarjetas/$matricula.jsx
async function loader2({ params: { matricula } }) {
  (0, import_tiny_invariant.default)(matricula, "expected matricula");
  let tarjetas = await getTarjetas(matricula), historico = await getHistorico(matricula), [{ fullName, club, handicapIndex }] = await findPlayersFromVista(matricula);
  return (0, import_node2.json)({ tarjetas, fullName, club, handicapIndex, historico });
}
function Tarjetas() {
  let hideMobileStyles = { display: { sm: "none", md: "table-cell" } }, { matricula } = (0, import_react6.useParams)(), { tarjetas, fullName, club, handicapIndex, historico } = (0, import_react6.useLoaderData)(), theme2 = (0, import_styles3.useTheme)(), [orderBy, setOrderBy] = (0, import_react7.useState)("fecha"), [ascSort, setAscSort] = (0, import_react7.useState)(!1), sortDirection = ascSort ? "asc" : "desc", sortBy = (newOrderBy) => {
    setOrderBy(newOrderBy), setAscSort(newOrderBy === orderBy ? !ascSort : !0);
  }, sortedTarjetas = (0, import_react7.useMemo)(() => tarjetas.sort((a, b) => {
    let value;
    switch (orderBy) {
      case "fecha": {
        value = new Date(a.isoDate) - new Date(b.isoDate);
        break;
      }
      case "club": {
        value = a.clubName.localeCompare(b.clubName);
        break;
      }
      case "calificacion": {
        value = a.courseRating - b.courseRating;
        break;
      }
      case "slope": {
        value = a.slopeRating - b.slopeRating;
        break;
      }
      case "score-adj": {
        value = a.adjustedScore - b.adjustedScore;
        break;
      }
      case "dif": {
        value = a.diferencial - b.diferencial;
        break;
      }
    }
    return ascSort ? value : value * -1;
  }), [tarjetas, orderBy, ascSort]);
  return sortedTarjetas.length === 0 ? /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    m: "auto"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, null, "No se encontraron tarjetas para este jugador")) : /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: { p: 3 }
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, {
    variant: "h5",
    component: "p",
    sx: { py: 2, display: "flex" }
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    component: "span",
    sx: { mr: 1, display: { xs: "none", sm: "flex" } }
  }, fullName, " (", club, ").", " "), "Matr\xEDcula ", matricula, ".", " ", /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: { ml: "auto", textAlign: "right" },
    component: "span"
  }, "H\xE1ndicap Index: ", handicapIndex)), /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: { display: "flex", py: 2 }
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: {
      mr: 1,
      borderRadius: 1,
      width: 40,
      height: 20,
      bgcolor: theme2.palette.success.light
    }
  }), /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, null, "Ocho mejores"), /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: {
      ml: 2,
      mr: 1,
      borderRadius: 1,
      width: 40,
      height: 20,
      bgcolor: hexToRGB(theme2.palette.warning.light, 0.2)
    }
  }), /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, null, "Ingresan el pr\xF3ximo jueves")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableContainer, {
    sx: { flexGrow: 1 },
    component: import_material4.Paper
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Table, {
    stickyHeader: !0,
    "aria-label": "tarjetas del jugador"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableHead, null, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableRow, null, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "left"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "fecha",
    direction: orderBy === "fecha" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("fecha")
  }, "Fecha")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "left"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "club",
    direction: orderBy === "club" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("club")
  }, "Club")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "center"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "score-adj",
    direction: orderBy === "score-adj" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("score-adj")
  }, "Score (ajustado)")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "center",
    sx: hideMobileStyles
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "calificacion",
    direction: orderBy === "calificacion" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("calificacion")
  }, "Calificaci\xF3n")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "center",
    sx: hideMobileStyles
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "slope",
    direction: orderBy === "slope" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("slope")
  }, "Slope")), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
    align: "center"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Tooltip, {
    title: "(113 / Slope) x (Score Ajustado \u2013 Calificaci\xF3n - PCC)"
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableSortLabel, {
    active: orderBy === "dif",
    direction: orderBy === "dif" ? sortDirection : void 0,
    onClick: (_ev) => sortBy("dif")
  }, "Diferencial Ajustado", /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    ml: 1
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, {
    color: "textSecondary"
  }, /* @__PURE__ */ import_react7.default.createElement(import_Info.default, null)))))))), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableBody, null, sortedTarjetas.map((tarjeta) => {
    let backgroundColor;
    return tarjeta.processed ? tarjeta.selected && (backgroundColor = theme2.palette.success.light) : backgroundColor = hexToRGB(theme2.palette.warning.light, 0.2), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableRow, {
      sx: {
        backgroundColor
      },
      key: tarjeta.id
    }, /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      align: "left"
    }, tarjeta.formattedDate), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      align: "left"
    }, tarjeta.clubName.trim()), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      align: "center"
    }, tarjeta.score, tarjeta.adjustedScore !== tarjeta.score && ` (${tarjeta.adjustedScore})`, tarjeta.PCC > 0 ? ` PCC ${tarjeta.PCC}` : ""), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      sx: hideMobileStyles,
      align: "center"
    }, tarjeta.courseRating), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      sx: hideMobileStyles,
      align: "center"
    }, tarjeta.slopeRating), /* @__PURE__ */ import_react7.default.createElement(import_material4.TableCell, {
      align: "center"
    }, tarjeta.diferencial.toFixed(1), tarjeta.is9Holes ? "*" : void 0));
  })))), /* @__PURE__ */ import_react7.default.createElement(Chart, {
    data: historico.map(({ handicapIndex: y, dateMs: x }) => ({ x, y }))
  }));
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ import_react7.default.createElement(import_material4.Box, {
    sx: { m: "auto", p: 2, textAlign: "center" }
  }, /* @__PURE__ */ import_react7.default.createElement(import_material4.Typography, {
    variant: "h4"
  }, "Hubo un error al buscar las tarjetas de este jugador. Intente m\xE1s tarde."));
}
function unstable_shouldReload() {
  return !1;
}

// app/routes/index.jsx
var routes_exports = {};
__export(routes_exports, {
  default: () => App2,
  headers: () => headers
});
var import_material5 = require("@mui/material");
function headers() {
  return {
    "Cache-Control": `max-age=${yearsToSeconds(1)}, s-maxage=${yearsToSeconds(1)}`
  };
}
function App2() {
  return /* @__PURE__ */ React.createElement(import_material5.Box, {
    sx: { m: "auto", p: 2, textAlign: "center" }
  }, /* @__PURE__ */ React.createElement(import_material5.Typography, {
    variant: "h4"
  }, "Elija un jugador para consultar sus \xFAltimas 20 tarjetas."));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "819c1a94", entry: { module: "/build/entry.client-IMSCVJYP.js", imports: ["/build/_shared/chunk-7GCXT7UG.js", "/build/_shared/chunk-UYRTJLQX.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-TRKDFYXB.js", imports: ["/build/_shared/chunk-COSH7WVH.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-BZ3W25QY.js", imports: ["/build/_shared/chunk-H56GKHTK.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/tarjetas/$matricula": { id: "routes/tarjetas/$matricula", parentId: "root", path: "tarjetas/:matricula", index: void 0, caseSensitive: void 0, module: "/build/routes/tarjetas/$matricula-MZVKTPDL.js", imports: ["/build/_shared/chunk-H56GKHTK.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 } }, url: "/build/manifest-819C1A94.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/tarjetas/$matricula": {
    id: "routes/tarjetas/$matricula",
    parentId: "root",
    path: "tarjetas/:matricula",
    index: void 0,
    caseSensitive: void 0,
    module: matricula_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
