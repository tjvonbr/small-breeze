import db from "./prisma";

export async function ensureUserHasTeam(userId: string, defaultTeamName: string) {
  const existingTeam = await db.team.findFirst({
    where: {
      memberships: {
        some: {
          userId,
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
      memberships: {
        create: { userId, role: 'ADMIN' },
      },
    },
  });

  return newTeam;
}


