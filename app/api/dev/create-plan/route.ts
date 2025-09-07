import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../server/db";

export async function POST(req: NextRequest) {
  const org = await prisma.org.findFirst();
  const ac = await prisma.aircraft.findFirst();
  const plan = await prisma.plan.create({ data: { name: "Demo Plan", orgId: org!.id, aircraftId: ac!.id } });
  return NextResponse.json({ ok: true, plan });
}
