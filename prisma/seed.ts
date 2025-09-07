import { PrismaClient, Standard, ItemType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.org.upsert({
    where: { id: "seed-org" },
    update: {},
    create: { id: "seed-org", name: "Demo Airline" }
  });

  await prisma.aircraftType.create({
    data: { oem: "Airbus", model: "A320neo", iata: "32N", icao: "A20N" }
  }).catch(()=>{});

  const type = await prisma.aircraftType.findFirst({ where: { model: "A320neo" } });

  const ac = await prisma.aircraft.create({
    data: {
      tail: "CC-DEM0",
      orgId: org.id,
      typeId: type!.id
    }
  });

  await prisma.galleyStation.createMany({
    data: [
      { aircraftId: ac.id, code: "FWD-G1", widthMm: 900, heightMm: 1000, depthMm: 600, standard: Standard.ATLAS },
      { aircraftId: ac.id, code: "AFT-G2", widthMm: 1200, heightMm: 1000, depthMm: 600, standard: Standard.ATLAS }
    ]
  });

  await prisma.catalogItem.createMany({
    data: [
      { code: "AT-DRWR-Std", name: "ATLAS Drawer", standard: Standard.ATLAS, widthMm: 405, heightMm: 100, depthMm: 600, tareWeightGrams: 1200, type: ItemType.DRAWER, orgId: null },
      { code: "AT-CART-Full", name: "ATLAS Full Cart", standard: Standard.ATLAS, widthMm: 305, heightMm: 1030, depthMm: 810, tareWeightGrams: 15000, type: ItemType.CART, orgId: null },
      { code: "AT-INSERT-1-2", name: "ATLAS Half Insert", standard: Standard.ATLAS, widthMm: 205, heightMm: 100, depthMm: 300, tareWeightGrams: 500, type: ItemType.INSERT_1_2, orgId: null }
    ]
  });

  console.log("Seeded demo data.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
