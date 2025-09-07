import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { items } = await req.json();
  const id = params.id;
  // Replace plan items (simple upsert for demo)
  await prisma.planItem.deleteMany({ where: { loadPlanId: id } });
  await prisma.planItem.createMany({ data: items.map((it: any) => ({
    loadPlanId: id,
    compartmentId: it.compartmentId,
    refType: it.refType,
    refId: it.refId,
    qty: it.qty,
    posX: it.posX,
    posY: it.posY
  })) });
  return NextResponse.json({ ok: true });
}
