import type { Tarjeta } from "~/types";
import { date as dateUtils } from "~/utils";

interface TarjetasPageProps {
  tarjetas: Array<Tarjeta & { selected?: boolean; historica?: boolean }>;
  fullName: string;
  clubName: string;
  handicapIndex: number | null;
  handicapDate: string | null;
  matricula: string;
  viendoHistoricas: boolean;
}

export function TarjetasPage({
  tarjetas,
  fullName,
  clubName,
  handicapIndex,
  handicapDate,
  matricula,
  viendoHistoricas,
}: TarjetasPageProps): JSX.Element {
  if (tarjetas.length === 0) {
    return (
      <div class="m-auto text-2xl text-center">
        No se encontraron tarjetas para {fullName || `matrícula ${matricula}`}
      </div>
    );
  }

  const untilDate = handicapDate ? dateUtils.make7Am(new Date(handicapDate)) : null;
  if (untilDate) {
    untilDate.setDate(untilDate.getDate() + 7);
  }

  const bg = {
    best: "bg-green-600",
    next: "bg-orange-300",
  };

  return (
    <div class="p-5">
      <div class="flex text-xl py-3">
        {fullName && (
          <span class="hidden lg:inline-flex capitalize">
            {fullName} ({clubName}).
          </span>
        )}
        <span class="lg:ml-1">Matrícula {matricula}.</span>
        {untilDate && handicapIndex !== null && (
          <span class="ml-auto text-right">
            Hándicap Index: {handicapIndex} (hasta el {dateUtils.format(untilDate)})
          </span>
        )}
      </div>

      <div class="flex py-4 items-center">
        <div class={`mr-2 rounded-sm w-8 h-4 ${bg.best}`}></div>
        <span>Ocho mejores</span>
        <div class={`ml-6 mr-2 rounded-sm w-8 h-4 ${bg.next}`}></div>
        <span>Ingresan el próximo jueves</span>
        <label class="flex ml-auto text-sm">
          <input
            type="checkbox"
            name="todas"
            checked={viendoHistoricas}
            class="w-4 mr-2"
            onchange={`window.location.href = '/tarjetas/${matricula}' + (this.checked ? '?todas=1#historica-0' : '')`}
          />
          Ver históricas
        </label>
      </div>

      <div class="w-full overflow-x-auto">
        <table aria-label="tarjetas del jugador" class="my-1 bg-white rounded-md shadow-sm w-full">
          <thead>
            <tr>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Club</TableHeader>
              <TableHeader className="text-center">Score (ajustado)</TableHeader>
              <TableHeader className="text-center">Calificación</TableHeader>
              <TableHeader className="text-center">Slope</TableHeader>
              <TableHeader
                className="text-center"
                title="(113 / Slope) x (Score Ajustado – Calificación - PCC)"
              >
                <span class="flex items-center justify-center">
                  Diferencial Ajustado
                  <svg
                    class="ml-1 w-5 hidden lg:block text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                </span>
              </TableHeader>
            </tr>
          </thead>
          <tbody id="tarjetas-body">
            {tarjetas.map((tarjeta, index) => (
              <TarjetaRow
                key={tarjeta.id}
                tarjeta={tarjeta}
                index={index}
                bgBest={bg.best}
                bgNext={bg.next}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TableHeaderProps {
  className?: string;
  title?: string;
  children: JSX.Element | string | (JSX.Element | string)[];
}

function TableHeader({ className = "", title, children }: TableHeaderProps): JSX.Element {
  return (
    <th
      class={`px-3 py-4 border-b border-slate-300 text-sm font-semibold ${className}`}
      title={title}
    >
      {children}
    </th>
  );
}

interface TarjetaRowProps {
  tarjeta: Tarjeta & { selected?: boolean; historica?: boolean };
  index: number;
  bgBest: string;
  bgNext: string;
}

function TarjetaRow({ tarjeta, index, bgBest, bgNext }: TarjetaRowProps): JSX.Element {
  const cargaDate = new Date(tarjeta.cargaDate);
  const date = new Date(tarjeta.date);

  let bgColor = "";
  if (!tarjeta.processed) {
    bgColor = bgNext;
  } else if (tarjeta.selected) {
    bgColor = bgBest;
  }

  const isFirstHistorica = tarjeta.historica && index === 21;

  return (
    <tr
      id={tarjeta.historica ? `historica-${index - 20}` : undefined}
      class={`${bgColor} ${tarjeta.historica ? "opacity-50" : ""}`}
      {...(isFirstHistorica
        ? {
            "data-init__delay.100ms": "el.scrollIntoView({ behavior: 'smooth', block: 'center' })",
          }
        : {})}
    >
      <td
        class="border-b border-slate-300 px-3 py-4 text-sm"
        title={`Cargada ${cargaDate.getDate()}/${
          cargaDate.getMonth() + 1
        }/${cargaDate.getFullYear()}`}
      >
        {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
      </td>
      <td class="border-b border-slate-300 px-3 py-4 text-sm capitalize">{tarjeta.clubName}</td>
      <td class="border-b border-slate-300 px-3 py-4 text-sm text-center">
        {tarjeta.score}
        {tarjeta.adjustedScore !== tarjeta.score && ` (${tarjeta.adjustedScore})`}
        {tarjeta.PCC > 0 ? ` PCC ${tarjeta.PCC}` : ""}
      </td>
      <td class="border-b border-slate-300 px-3 py-4 text-sm text-center">
        {tarjeta.courseRating}
      </td>
      <td class="border-b border-slate-300 px-3 py-4 text-sm text-center">{tarjeta.slopeRating}</td>
      <td class="border-b border-slate-300 px-3 py-4 text-sm text-center">
        {tarjeta.diferencial.toFixed(1)}
        {tarjeta.is9Holes ? "*" : ""}
      </td>
    </tr>
  );
}

export function TarjetasNotFound({ matricula }: { matricula: string }): JSX.Element {
  return (
    <div class="m-auto text-2xl text-center">
      No se encontró ningún jugador con la matrícula {matricula}
    </div>
  );
}

export function TarjetasError(): JSX.Element {
  return (
    <div class="m-auto text-2xl text-center">
      Hubo un error al buscar las tarjetas de este jugador. Intente más tarde.
    </div>
  );
}
