import "reflect-metadata";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { AppDataSource } from "./data-source";
import routes from "./routes/route";
import transactionsRoutes from "./routes/transactions";
import userRoutes from "./routes/user";
import familyRoutes from "./routes/family";
import bankRoutes from "./routes/bankLocations";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3002", // Local machine
  "http://localhost:3000", // Local machine
  "http://123.45.67.89:3000", // VPS IP address
  "http://example.com:3000", // VPS domain
  "https://eco-loop.diyanpratama.com/",
  "http://192.168.1.9:3000",
];

const isLocalIP = (origin: string | undefined) => {
  const localIPRegex = /^(http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):\d+)$/;
  return localIPRegex.test(origin ?? '');
};

app.use(
  "/api",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin (e.g., Postman)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
  [routes, transactionsRoutes, userRoutes, familyRoutes, bankRoutes]
);

app.use(errorHandler);

// Start the server after data source initialization
AppDataSource.initialize().then(() => {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
