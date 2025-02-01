import { defineConfig } from "drizzle-kit";
import { config} from 'dotenv';

config({ path: ".env.local" });

export default defineConfig({
    dialect: 'postgresql',
    out: './db/migrations',
    schema: './db/schema',
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})
