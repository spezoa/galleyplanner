import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: "demo-tenant" },
    update: {},
    create: { id: "demo-tenant", name: "Demo Airline" },
  });

  // A320 aircraft + FWD galley
  const ac = await prisma.aircraft.create({
    data: { tenantId: tenant.id, type: "A320", subvariant: "NEO", notes: "Demo A320", },
  });

  const galley = await prisma.galley.create({
    data: { aircraftId: ac.id, code: "FWD1" },
  });

  // Example compartments (dimensions illustrative, adjust to your spec)
  // Atlas drawer bay (grid 3x4)
  const comp1 = await prisma.compartment.create({
    data: {
      galleyId: galley.id, code: "DWR-A", std: "ATLAS",
      widthMM: 420, heightMM: 300, depthMM: 400, maxWeightKG: 20,
      chilled: false, gridX: 3, gridY: 4
    },
  });

  // Chilled compartment (grid 2x2)
  const comp2 = await prisma.compartment.create({
    data: {
      galleyId: galley.id, code: "CHL-1", std: "ATLAS",
      widthMM: 420, heightMM: 300, depthMM: 400, maxWeightKG: 18,
      chilled: true, gridX: 2, gridY: 2
    },
  });

  // Atlas container types
  const drawerType = await prisma.containerType.create({
    data: {
      tenantId: tenant.id, name: "ATLAS Drawer", std: "ATLAS",
      widthMM: 405, heightMM: 115, depthMM: 380, tareWeightKG: 1.2
    },
  });

  const halfCartType = await prisma.containerType.create({
    data: {
      tenantId: tenant.id, name: "Half Cart", std: "ATLAS",
      widthMM: 302, heightMM: 1030, depthMM: 400, tareWeightKG: 12.0
    },
  });

  // Example containers
  await prisma.container.createMany({
    data: [
      { tenantId: tenant.id, containerTypeId: drawerType.id, code: "D01" },
      { tenantId: tenant.id, containerTypeId: drawerType.id, code: "D02" },
      { tenantId: tenant.id, containerTypeId: halfCartType.id, code: "HC1" },
    ]
  });

  // Sample products
  const water = await prisma.product.create({
    data: { tenantId: tenant.id, sku: "WAT500", name: "Water 500ml",
      widthMM: 70, heightMM: 210, depthMM: 70, unitWeightG: 520, tags: ["DRY"], allergens: [] }
  });
  const snack = await prisma.product.create({
    data: { tenantId: tenant.id, sku: "SNK01", name: "Snack Bar",
      widthMM: 40, heightMM: 20, depthMM: 120, unitWeightG: 40, tags: ["DRY"], allergens: ["nuts"] }
  });

  // Sample kit
  const kit = await prisma.kit.create({
    data: { tenantId: tenant.id, name: "Water & Snack" }
  });
  await prisma.kitItem.createMany({
    data: [
      { kitId: kit.id, productId: water.id, qty: 1 },
      { kitId: kit.id, productId: snack.id, qty: 1 },
    ]
  });

  // Sample load plan with a couple of items pre-placed
  const plan = await prisma.loadPlan.create({
    data: { tenantId: tenant.id, aircraftId: ac.id, name: "Demo A320 FWD Plan", createdBy: "seed" }
  });

  await prisma.planItem.createMany({
    data: [
      { loadPlanId: plan.id, compartmentId: comp1.id, refType: "product", refId: water.id, qty: 6, posX: 0, posY: 0 },
      { loadPlanId: plan.id, compartmentId: comp1.id, refType: "kit", refId: kit.id, qty: 4, posX: 1, posY: 0 },
      { loadPlanId: plan.id, compartmentId: comp2.id, refType: "product", refId: snack.id, qty: 8, posX: 0, posY: 1 },
    ]
  });

  // Simple rules
  await prisma.rule.createMany({
    data: [
      { tenantId: tenant.id, type: "MAX_WEIGHT", params: { maxKgPerCompartment: 20 } },
      { tenantId: tenant.id, type: "CHILLED_ONLY", params: { tag: "FF" } },
    ]
  });

  console.log("Seed complete");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
