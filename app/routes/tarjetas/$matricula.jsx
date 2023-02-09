import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import React, { Fragment, useRef, useState } from "react";
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
        className={`relative flex mr-auto text-sm font-semibold items-center group ${
          direction === undefined ? `hover:opacity-60` : ""
        } ${className}`}
        title={title}
      >
        {children}
        {direction === "desc" && <ArrowSmallDownIcon className={iconClass} />}
        {direction !== "desc" && (
          <ArrowSmallUpIcon
            className={`${iconClass} ${
              direction === undefined
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

const months = [1, 3, 6];

export async function loader(
  { request, params: { matricula: matriculaAsString } },
) {
  if (!matriculaAsString) throw new Error("Expected matricula");
  const url = new URL(request.url);
  const todas = url.searchParams.get("todas");
  const monthsParam = url.searchParams.get("months") ?? months[0];
  const matricula = Number(matriculaAsString);
  const tarjetas = await getTarjetas(matricula, todas);
  const historico = await getHistorico(matricula, monthsParam);
  const chartData = historico.map(({ handicapIndex, date }) => ({
    x: new Date(date).getTime(),
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
    handicapDate: handicapDateString,
  } = player;
  return json({
    tarjetas,
    fullName,
    clubName,
    handicapIndex,
    handicapDateString,
    chartData,
  });
}

export function headers() {
  return {
    "Cache-Control":
      `max-age=0, s-maxage=0, stale-while-revalidate=${date.secondsToNextThursday()}`,
  };
}

export default function Tarjetas() {
  const hideMobileStyles = { display: { sm: "none", md: "table-cell" } };
  const chartRef = useRef();
  const submit = useSubmit();
  const transition = useTransition();
  const { matricula } = useParams();
  const [searchParams] = useSearchParams();
  const viendoHistoricas = Boolean(searchParams.get("todas"));
  const {
    tarjetas,
    fullName,
    clubName,
    handicapIndex,
    handicapDateString,
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
  const sortedTarjetas = tarjetas.sort((a, b) => {
    let value;
    switch (orderBy) {
      case "fecha": {
        value = new Date(a.date) - new Date(b.date);
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
  });
  const mostrandoHistoricas = sortedTarjetas.length > 20;
  if (sortedTarjetas.length === 0) {
    return (
      <div className="m-auto text-2xl text-center">
        No se encontraron tarjetas para {fullName}
      </div>
    );
  }
  let untilDate = new Date(handicapDateString);
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
      <div className="flex py-4 items-center">
        <div
          className={`mr-2 rounded-sm w-8 h-4 ${bg.best}`}
        >
        </div>
        <span>Ocho mejores</span>
        <div
          className={`ml-6 mr-2 rounded-sm w-8 h-4 ${bg.next}`}
        >
        </div>
        <span>Ingresan el próximo jueves</span>
        <label className="flex ml-auto text-sm">
          <input
            type="checkbox"
            name="todas"
            defaultChecked={viendoHistoricas}
            className="w-4 mr-2"
            onClick={(_e) => {
              if (!viendoHistoricas) {
                chartRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }}
          />
          Ver históricas
        </label>
      </div>
      <div className="w-full overflow-x-auto">
        <table
          aria-label="tarjetas del jugador"
          className="my-1 bg-white rounded-md shadow-sm w-full"
        >
          <thead>
            <tr>
              <TableHeader
                direction={orderBy === "fecha" ? sortDirection : undefined}
                onClick={(_ev) => sortBy("fecha")}
              >
                Fecha
              </TableHeader>
              <TableHeader
                direction={orderBy === "club" ? sortDirection : undefined}
                onClick={(_ev) => sortBy("club")}
              >
                Club
              </TableHeader>
              <TableHeader
                direction={orderBy === "score-adj" ? sortDirection : undefined}
                onClick={(_ev) => sortBy("score-adj")}
                className="mx-auto hi"
              >
                Score (ajustado)
              </TableHeader>
              <TableHeader
                direction={orderBy === "calificacion"
                  ? sortDirection
                  : undefined}
                onClick={(_ev) => sortBy("calificacion")}
                className="mx-auto"
              >
                Calificación
              </TableHeader>
              <TableHeader
                direction={orderBy === "slope" ? sortDirection : undefined}
                onClick={(_ev) => sortBy("slope")}
                className="mx-auto"
              >
                Slope
              </TableHeader>
              <TableHeader
                direction={orderBy === "dif" ? sortDirection : undefined}
                onClick={(_ev) => sortBy("dif")}
                className="mx-auto"
                title="(113 / Slope) x (Score Ajustado – Calificación - PCC)"
              >
                Diferencial Ajustado
                <InformationCircleIcon
                  className={`ml-1 w-5 hidden lg:block ${iconColor}`}
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedTarjetas.map((tarjeta, index) => {
              const cargaDate = new Date(tarjeta.cargaDate);
              const date = new Date(tarjeta.date);
              let bgColor = "";
              if (!tarjeta.processed) {
                bgColor = bg.next;
              } else if (tarjeta.selected) {
                bgColor = bg.best;
              }
              return (
                <tr
                  id={tarjeta.historica
                    ? "historica-" + String(index - 20)
                    : undefined}
                  className={`${bgColor} ${
                    tarjeta.historica ? "opacity-50" : ""
                  }`}
                  key={tarjeta.id}
                >
                  <TableCell
                    title={`Cargada ${cargaDate.getDate()}/${
                      cargaDate.getMonth() +
                      1
                    }/${cargaDate.getFullYear()}`}
                  >
                    {date.getDate()}/{date.getMonth() +
                      1}/{date.getFullYear()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {tarjeta.clubName}
                  </TableCell>
                  <TableCell className="text-center">
                    {tarjeta.score}
                    {tarjeta.adjustedScore !== tarjeta.score &&
                      ` (${tarjeta.adjustedScore})`}
                    {tarjeta.PCC > 0 ? ` PCC ${tarjeta.PCC}` : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {tarjeta.courseRating}
                  </TableCell>
                  <TableCell className="text-center">
                    {tarjeta.slopeRating}
                  </TableCell>
                  <TableCell className="text-center">
                    {tarjeta.diferencial.toFixed(1)}
                    {tarjeta.is9Holes ? "*" : undefined}
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Chart
        ref={chartRef}
        data={chartData}
        months={months}
      />
    </Form>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div className="m-auto text-2xl text-center">
      Hubo un error al buscar las tarjetas de este jugador. Intente más tarde.
    </div>
  );
}

export function CatchBoundary() {
  const { matricula } = useParams();
  return (
    <div className="m-auto text-2xl text-center">
      No se encontró ningún jugador con la matrícula {matricula}
    </div>
  );
}
