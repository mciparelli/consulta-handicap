import { PrismaClient } from "@prisma/client";
import { date } from "~/utils";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

async function saveHistorico(players) {
  const lastThursDate = date.getLastThurs();
  for (const { matricula, clubName, fullName, handicapIndex } of players) {
    await prisma.jugadores.upsert({
      where: {
        matricula,
      },
      create: {
        matricula,
        fullName,
        clubName,
        handicap: {
          create: {
            handicapIndex,
            date: lastThursDate,
          },
        },
      },
      update: {
        fullName,
        clubName,
        handicap: {
          connectOrCreate: {
            where: {
              date_handicapIndex_matricula: {
                handicapIndex,
                date: lastThursDate,
                matricula,
              },
            },
            create: {
              handicapIndex,
              date: lastThursDate,
            },
          },
        },
      },
    });
  }
}

async function getHistorico(matricula) {
  const threeMonthsAgoDate = new Date();
  threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - 3);
  return prisma.handicap.findMany({
    where: {
      matricula,
      date: {
        gte: threeMonthsAgoDate,
      },
    },
    select: {
      date: true,
      handicapIndex: true,
    },
  });
}

async function getPlayer(matricula) {
  const player = await prisma.jugadores.findUnique({
    where: {
      matricula,
    },
    select: {
      fullName: true,
      clubName: true,
      handicap: {
        where: {
          date: date.getLastThurs(),
        },
        select: {
          handicapIndex: true,
        },
      },
    },
  });
  if (
    !player || !player.fullName || !player.clubName ||
    player.handicap.length === 0
  ) {
    return null;
  }
  const { clubName, fullName, handicap: [{ handicapIndex }] } = player;
  return { clubName, fullName, handicapIndex };
}

export { getHistorico, getPlayer, saveHistorico };
