import { json } from "@remix-run/node";
import { findPlayers } from "~/api";
import { date } from "~/utils";

export async function loader({ request }) {
  const url = new URL(request.url);
  const players = await findPlayers(url.searchParams.get("searchString"));
  return json(players, {
    headers: {
      "Cache-Control": `max-age=0, s-maxage=${date.secondsToNextThursday()}`,
    },
  });
}
