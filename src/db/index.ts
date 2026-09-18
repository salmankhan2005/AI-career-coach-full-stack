import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = import.meta.env.VITE_DATABASE_URL || "postgresql://dummy:dummy@ep-empty.us-east-1.aws.neon.tech/dummy?sslmode=require";
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });
