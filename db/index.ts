// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle("postgres://mcdonald:litch&lemonade@localhost:5432/ace-rural-surveillance-db");

const result = await db.execute('select 1');
