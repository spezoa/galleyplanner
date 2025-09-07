'use server';

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function listPlans() {
  const plans = await prisma.plan.findMany({
    include: { aircraft: true },
    orderBy: { createdAt: "desc" as any }
  }).catch(()=>[] as any[]);
  return plans as any[];
}

export async function getPlan(id: string) {
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { aircraft: true, currentVersion: true }
  });
  return plan as any;
}

export async function createPlan({ name }: { name: string }) {
  const ac = await prisma.aircraft.findFirst();
  const p = await prisma.plan.create({
    data: { name, orgId: (await prisma.org.findFirst())!.id, aircraftId: ac!.id, status: "DRAFT" as any }
  });
  revalidatePath("/plans");
  return p;
}
