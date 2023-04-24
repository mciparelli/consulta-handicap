import { PrismaClient } from "@prisma/client";

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
  for (
    const { matricula, clubName, fullName, handicapIndex, handicapDate }
      of players
  ) {
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
            date: handicapDate,
          },
        },
      },
      update: {
        fullName,
        clubName,
        handicap: {
          upsert: {
            where: {
              date_matricula: {
                date: handicapDate,
                matricula,
              },
            },
            create: {
              handicapIndex,
              date: handicapDate,
            },
            update: {
              handicapIndex,
            },
          },
        },
      },
    });
  }
}

function getHistorico(matricula, months) {
  const threeMonthsAgoDate = new Date();
  threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - months);
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
        take: 1,
        orderBy: {
          date: "desc",
        },
        select: {
          date: true,
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
  const {
    clubName,
    fullName,
    handicap: [{ handicapIndex, date: handicapDate }],
  } = player;
  handicapDate.setHours(handicapDate.getHours() + 4);
  return { clubName, fullName, handicapIndex, handicapDate };
}

export { getHistorico, getPlayer, saveHistorico };
