import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
let pool:Pool|undefined;
export function getPool(){
 if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not configured.');
 return pool??=new Pool({connectionString:process.env.DATABASE_URL,max:5,idleTimeoutMillis:10000,connectionTimeoutMillis:10000});
}
export function getDb(){return drizzle(getPool(),{schema});}
