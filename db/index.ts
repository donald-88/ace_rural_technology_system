import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const sql = neon<boolean, boolean>(process.env.DATABASE_URL!)
export const db = drizzle({ client: sql });
