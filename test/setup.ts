import "@testing-library/jest-dom";
import { execSync } from "child_process";
import dotenv from "dotenv";

// Load .env.test or .env.testing for test environment variables
dotenv.config({ path: ".env.test" });

// Run Prisma migrate to ensure the test DB schema is up to date before tests run
execSync("npx prisma migrate deploy", { stdio: "inherit" });
