import { prisma } from "../server/db";

export async function getPlanByToken(token: string) {
  const ver = await prisma.planVersion.findFirst({ where: { token }, include: { plan: true, placements: true } });
  if (!ver) return null;
  // For demo, just take first station if any
  const station = await prisma.galleyStation.findFirst({ where: { aircraftId: ver.plan.aircraftId } });
  return { plan: ver.plan, placements: ver.placements, station };
}
