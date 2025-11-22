import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Running seed...");

  // Create Manager user
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@odoo.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@odoo.com",
      password,
      role: "MANAGER"
    }
  });

  console.log("👤 Admin user:", admin.email);

  // Create warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { name: "Main Warehouse" },
    update: {},
    create: {
      name: "Main Warehouse",
      address: "Default Address"
    }
  });

  console.log("🏭 Warehouse:", warehouse.name);

  // Create location
const location = await prisma.location.upsert({
  where: {
    warehouse_location_unique: {
      warehouseId: warehouse.id,
      name: "Primary Location"
    }
  },
  update: {},
  create: {
    name: "Primary Location",
    code: "MAIN-01",
    warehouseId: warehouse.id
  }
});


  console.log("📦 Location:", location.name);

  // Sample product (optional)
  const product = await prisma.product.upsert({
    where: { sku: "SKU-001" },
    update: {},
    create: {
      name: "Demo Product",
      sku: "SKU-001",
      uom: "pcs"
    }
  });

  console.log("🛠 Product:", product.sku);

  console.log("🌱 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
