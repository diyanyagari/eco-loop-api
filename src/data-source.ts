import "dotenv/config";
import { DataSource } from "typeorm";
import { BankLocation } from "./entity/BankLocation";
import { Family } from "./entity/Family";
import { Admin } from "./entity/Admin";
import { Transaction } from "./entity/Transaction";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Synchronize in development only
  logging: true,
  entities: [User, Transaction, BankLocation, Family, Admin], // Add entities here
  subscribers: [],
  migrations: ["src/migration/**/*.ts"],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
