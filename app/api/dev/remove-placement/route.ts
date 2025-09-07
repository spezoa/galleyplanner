import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../server/db";

export async function POST(req: NextRequest) {
  const { placementId } = await req.json();
  await prisma.placement.delete({ where: { id: placementId } }).catch(()=>{});
  return NextResponse.json({ ok: true });
}
