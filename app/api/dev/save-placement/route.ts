import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../server/db";

export async function POST(req: NextRequest) {
  const { planId, pl } = await req.json();
  // Ensure a PlanVersion exists (working draft)
  let plan = planId ? await prisma.plan.findUnique({ where: { id: planId } }) : await prisma.plan.findFirst();
  if (!plan) return NextResponse.json({ ok: false });
  let ver = await prisma.planVersion.findFirst({ where: { planId: plan.id }, orderBy: { version: 'desc' } });
  if (!ver) ver = await prisma.planVersion.create({ data: { planId: plan.id, createdBy: 'demo' } });
  const station = await prisma.galleyStation.findFirst({ where: { aircraftId: plan.aircraftId } });
  const item = await prisma.catalogItem.findFirst();
  await prisma.placement.create({
    data: {
      planVersionId: ver.id,
      stationId: station!.id,
      catalogItemId: item!.id,
      xMm: Math.max(0, pl.xMm),
      yMm: Math.max(0, pl.yMm),
      rotateDeg: pl.rotateDeg ?? 0,
      qty: 1
    }
  });
  return NextResponse.json({ ok: true });
}
