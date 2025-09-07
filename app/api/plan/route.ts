import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  const plans = await prisma.loadPlan.findMany({
    include: { items: true }
  });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, aircraftId, tenantId } = body;
  const plan = await prisma.loadPlan.create({
    data: { name, aircraftId, tenantId, createdBy: "web" }
  });
  return NextResponse.json(plan, { status: 201 });
}
