import { date } from "../utils";

function headers() {
  return {
    "Cache-Control": `max-age=0, s-maxage=${date.secondsToNextThursday()}`,
  };
}

export default function Home() {
  return (
    <div className="m-auto text-2xl text-center">
      Elija un jugador para consultar sus últimas 20 tarjetas.
    </div>
  );
}
