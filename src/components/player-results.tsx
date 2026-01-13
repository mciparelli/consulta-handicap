import type { Player } from "~/types";

interface PlayerResultsProps {
  players: Player[];
}

export function PlayerResults({ players }: PlayerResultsProps): JSX.Element {
  const validPlayers = players.filter(
    (player) => !isNaN(player.handicapIndex) && player.handicapIndex !== null
  );

  if (validPlayers.length === 0) {
    return (
      <div
        id="player-results"
        data-show="$showResults && !$fetching"
        style="display: none"
        class="z-10 absolute bg-white max-h-60 mt-1 overflow-auto rounded-md shadow-lg w-full"
      >
        <div class="py-3 px-4 text-gray-500 text-sm">No se encontraron jugadores</div>
      </div>
    );
  }

  const initKey = `init-${Date.now()}`;

  return (
    <div
      id="player-results"
      style="display: none"
      class="z-10 absolute bg-white max-h-60 mt-1 overflow-auto rounded-md shadow-lg w-full"
      {...{
        "data-show": "$showResults && !$fetching",
      }}
    >
      <span
        id={initKey}
        data-init="$selectedIndex = 0; $showResults = true"
        style="display: none"
      ></span>
      {validPlayers.map((player, index) => (
        <a
          href={`/tarjetas/${player.matricula}`}
          class="cursor-pointer capitalize block truncate py-2 px-4 hover:bg-blue-700 hover:text-white"
          key={`${player.matricula}-${player.fullName}`}
          {...{
            "data-class": `{'bg-blue-700 text-white': $selectedIndex === ${index}}`,
            "data-on:mouseenter": `$selectedIndex = ${index}`,
          }}
        >
          {player.fullName} ({player.handicapIndex})
        </a>
      ))}
    </div>
  );
}
