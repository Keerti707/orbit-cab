import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { getPool } from '../db';
function createAuth(){
 if(!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length<32)throw new Error('Set a strong BETTER_AUTH_SECRET before enabling authentication.');
 return betterAuth({
  database:getPool(),
  secret:process.env.BETTER_AUTH_SECRET,
  baseURL:process.env.BETTER_AUTH_URL,
  emailAndPassword:{enabled:true,minPasswordLength:12,maxPasswordLength:128},
  rateLimit:{enabled:true,storage:'database',window:60,max:20},
  plugins:[nextCookies()]
 });
}

let instance:ReturnType<typeof createAuth>|undefined;
export function getAuth(){return instance??=createAuth();}
