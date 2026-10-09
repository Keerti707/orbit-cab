import {Pool} from 'pg';
import {getMigrations} from 'better-auth/db/migration';
import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required to migrate the database.');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:2,connectionTimeoutMillis:10000});
const client=await pool.connect();
try{
 await client.query('SELECT pg_advisory_lock(73521009)');
 const auth=await getMigrations({database:pool,emailAndPassword:{enabled:true,minPasswordLength:12},rateLimit:{enabled:true,storage:'database'}});
 await auth.runMigrations();
 await client.query(await readFile(new URL('../db/001_orbit.sql',import.meta.url),'utf8'));
 console.log('Orbit and authentication database migrations applied.');
}finally{await client.query('SELECT pg_advisory_unlock(73521009)');client.release();await pool.end();}
