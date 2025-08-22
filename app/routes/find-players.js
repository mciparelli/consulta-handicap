import { date } from "../utils";

async function loader({ request, context }) {
  const url = new URL(request.url);
  const players = await context.api.findPlayers(
    url.searchParams.get("searchString"),
    context,
  );
  return Response.json(players, {
    headers: {
      "Cache-Control": `max-age=${date.secondsToNextThursday()}`,
    },
  });
}

export { loader };
