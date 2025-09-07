import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../server/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const plan = body.planId ? await prisma.plan.findUnique({ where: { id: body.planId } }) : await prisma.plan.findFirst();
  if (!plan) return NextResponse.json({ ok: false }, { status: 400 });
  // Create a new version as "published"
  const last = await prisma.planVersion.findFirst({ where: { planId: plan.id }, orderBy: { version: 'desc' } });
  const ver = await prisma.planVersion.create({
    data: {
      planId: plan.id,
      version: (last?.version ?? 0) + 1,
      createdBy: "demo"
    }
  });
  await prisma.plan.update({ where: { id: plan.id }, data: { status: "PUBLISHED" as any, currentVersionId: ver.id } });
  return NextResponse.json({ ok: true, token: ver.token });
}
