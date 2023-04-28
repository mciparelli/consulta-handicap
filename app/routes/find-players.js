import { json } from "@remix-run/deno";
import { findPlayers } from "~/api";
import { date } from "~/utils";

async function loader({ request }) {
  const url = new URL(request.url);
  const players = await findPlayers(url.searchParams.get("searchString"));
  return json(players, {
    headers: {
      "Cache-Control": `max-age=${date.secondsToNextThursday()}`,
    },
  });
}

export { loader };
