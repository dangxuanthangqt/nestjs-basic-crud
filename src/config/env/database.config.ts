import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
}));
