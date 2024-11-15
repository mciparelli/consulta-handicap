import { json } from "@remix-run/deno";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import React, { Fragment, Suspense, useRef, useState } from "react";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { getHistorico, getPlayer, getTarjetas } from "~/api";
import { date, hexToRGB } from "~/utils";
import Chart from "~/components/chart";

const iconColor = "text-gray-500";

function TableHeader({ children, className = "", title, onClick, direction }) {
  const iconClass = `absolute mx-1 w-4 left-full ${iconColor}`;
  return (
    <th className="px-3 py-4 border-b border-slate-300 table-cell">
      <button
        onClick={onClick}
        className={`relative flex mr-auto text-sm font-semibold items-center group ${direction === undefined ? `hover:opacity-60` : ""
          } ${className}`}
        title={title}
      >
        {children}
        {direction === "desc" && <ArrowSmallDownIcon className={iconClass} />}
        {direction !== "desc" && (
          <ArrowSmallUpIcon
            className={`${iconClass} ${direction === undefined
              ? "transition-opacity opacity-0 group-hover:opacity-100"
              : ""
              }`}
          />
        )}
      </button>
    </th>
  );
}

function TableCell({ children, className = "", ...props }) {
  return (
    <td
      className={`border-b border-slate-300 px-3 py-4 text-sm ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

const months = [1, 3, 6, 12];

async function loader(
  { request, params: { matricula: matriculaAsString } },
) {
  if (!matriculaAsString) throw new Error("Expected matricula");
  const url = new URL(request.url);
  const todas = url.searchParams.get("todas");
  const monthsParam = url.searchParams.get("months") ?? months[0];
  const matricula = Number(matriculaAsString);
  // const tarjetas = await getTarjetas(matricula, todas);
  const historico = await getHistorico(matricula, monthsParam);
  const chartData = historico.map(({ handicapIndex, date }) => ({
    x: (new Date(date).getTime()),
    y: handicapIndex,
  }));
  const player = await getPlayer(
    matricula,
  );
  if (!player) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const {
    fullName,
    clubName,
    handicapIndex,
    handicapDate,
  } = player;
  return json({
    // tarjetas,
    fullName,
    clubName,
    handicapIndex,
    handicapDate,
    chartData,
  });
}

function headers() {
  return {
    "Cache-Control":
      `max-age=0, s-maxage=0, stale-while-revalidate=${date.secondsToNextThursday()}`,
  };
}

function Tarjetas() {
  const hideMobileStyles = { display: { sm: "none", md: "table-cell" } };
  const chartRef = useRef();
  const submit = useSubmit();
  const transition = useTransition();
  const { matricula } = useParams();
  const [searchParams] = useSearchParams();
  const viendoHistoricas = Boolean(searchParams.get("todas"));
  const {
    // tarjetas,
    fullName,
    clubName,
    handicapIndex,
    handicapDate,
    chartData,
  } = useLoaderData();
  const [orderBy, setOrderBy] = useState("fecha");
  const [ascSort, setAscSort] = useState(false);
  const sortDirection = ascSort ? "asc" : "desc";
  const bg = {
    best: "bg-green-600",
    next: "bg-orange-300",
  };
  const sortBy = (newOrderBy) => {
    setAscSort(newOrderBy === orderBy ? !ascSort : true);
    setOrderBy(newOrderBy);
  };
  // const sortedTarjetas = tarjetas.sort((a, b) => {
  //   let value;
  //   switch (orderBy) {
  //     case "fecha": {
  //       value = new Date(a.date) - new Date(b.date);
  //       break;
  //     }
  //     case "club": {
  //       value = a.clubName.localeCompare(b.clubName);
  //       break;
  //     }
  //     case "calificacion": {
  //       value = a.courseRating - b.courseRating;
  //       break;
  //     }
  //     case "slope": {
  //       value = a.slopeRating - b.slopeRating;
  //       break;
  //     }
  //     case "score-adj": {
  //       value = a.adjustedScore - b.adjustedScore;
  //       break;
  //     }
  //     case "dif": {
  //       value = a.diferencial - b.diferencial;
  //       break;
  //     }
  //   }
  //   return ascSort ? value : value * -1;
  // });
  // const mostrandoHistoricas = sortedTarjetas.length > 20;
  // if (sortedTarjetas.length === 0) {
  //   return (
  //     <div className="m-auto text-2xl text-center">
  //       No se encontraron tarjetas para {fullName}
  //     </div>
  //   );
  // }
  let untilDate = date.make7Am(new Date(handicapDate))
  untilDate.setDate(untilDate.getDate() + 7);
  return (
    <Form
      className="p-5"
      method="get"
      action="?"
      onChange={(event) => submit(event.currentTarget)}
    >
      <div className="flex text-xl py-3">
        <span className="hidden lg:inline-flex capitalize">
          {fullName} ({clubName}).
        </span>
        <span className="lg:ml-1">Matrícula {matricula}.</span>
        <span className="ml-auto text-right">
          Hándicap Index: {handicapIndex} (hasta el {date.format(untilDate)})
        </span>
      </div>
      <div className="flex flex-col justify-center text-2xl text-center py-10">
        <div>Este servicio funcionaba con URLs públicas de la AAG quien ahora decidió protegerlas con un captcha.</div>
        <div>Puede consultar sus tarjetas cargadas en la AAG en formato JSON <a className="text-blue-500" target="_blank" href={`https://www.aag.org.ar/cake/Usuarios/getTarjetas/${matricula}`}>desde aquí</a>.</div>
      </div>
      <Suspense fallback={null}>
        <Chart
          ref={chartRef}
          data={chartData}
          months={months}
        />
      </Suspense>
    </Form>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  const { matricula } = useParams();
  return (
    <div className="m-auto text-2xl text-center">
      {isRouteErrorResponse(error)
        ? `No se encontró ningún jugador con la matrícula ${matricula}`
        : "Hubo un error al buscar las tarjetas de este jugador. Intente más tarde."}
    </div>
  );
}

export { ErrorBoundary, headers, loader, Tarjetas as default };
