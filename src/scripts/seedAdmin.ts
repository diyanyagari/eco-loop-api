import * as bcrypt from "bcryptjs";
import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";

async function seedAdmin() {
  await AppDataSource.initialize();

  const thisUser = process.env.ADMIN_USER as string
  const thisPassword = process.env.ADMIN_PASSWORD as string

  const adminRepo = AppDataSource.getRepository(Admin);
  const existingAdmin = await adminRepo.findOne({
    where: { username: thisUser },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(thisPassword, 10);
    const admin = adminRepo.create({
      username: thisUser,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await adminRepo.save(admin);
    console.log("Admin berhasil ditambahkan!");
  } else {
    console.log("Admin sudah ada.");
  }

  await AppDataSource.destroy();
}

seedAdmin().catch(console.error);
