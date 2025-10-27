import db from "./prisma";

export async function ensureUserHasTeam(userId: string, defaultTeamName: string) {
  const existingTeam = await db.team.findFirst({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (existingTeam) {
    return existingTeam;
  }

  const newTeam = await db.team.create({
    data: {
      name: defaultTeamName,
      members: {
        connect: { id: userId },
      },
    },
  });

  return newTeam;
}


