import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

console.log('==================================================');
console.log('   LOGIX SUPABASE CONNECTION VERIFICATION REPORT  ');
console.log('==================================================\n');

console.log('1. ENVIRONMENT CONFIGURATION:');
console.log(` - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
console.log(` - DIRECT_URL:   ${process.env.DIRECT_URL ? '✅ Configured' : '❌ Missing'}`);
console.log(` - SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing'}`);
console.log(` - SUPABASE_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Configured' : '❌ Missing'}`);

const prisma = new PrismaClient();

async function runAudit() {
  console.log('\n2. POSTGRESQL DB CONNECTION (VIA PRISMA ORM):');
  try {
    const start = Date.now();
    const serverInfo: any[] = await prisma.$queryRaw`SELECT current_database(), current_user, version();`;
    const latency = Date.now() - start;

    console.log(` - Status: ✅ SUCCESS (Latency: ${latency}ms)`);
    console.log(` - Database Name: ${serverInfo[0]?.current_database}`);
    console.log(` - DB User: ${serverInfo[0]?.current_user}`);
    console.log(` - Postgres Version: ${serverInfo[0]?.version}`);

    console.log('\n3. LOGIX DATABASE TABLES & RECORD COUNTS:');
    const users = await prisma.user.findMany({ select: { id: true, fullName: true, email: true, userType: true } });
    const roles = await prisma.role.findMany({ select: { id: true, roleName: true, displayName: true } });
    const stores = await prisma.store.findMany({ select: { id: true, storeCode: true, storeName: true } });
    const courses = await prisma.course.findMany({ select: { id: true, code: true, title: true } });

    console.log(` - auth_users (${users.length}):`, users);
    console.log(` - auth_roles (${roles.length}):`, roles);
    console.log(` - org_stores (${stores.length}):`, stores);
    console.log(` - crs_courses (${courses.length}):`, courses);

  } catch (error: any) {
    console.error(' - Status: ❌ FAILED');
    console.error(' - Error:', error.message || error);
  }

  console.log('\n4. SUPABASE HTTP REST API TEST:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && apiKey) {
    try {
      // Test root API ping
      const pingRes = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      });
      console.log(` - Endpoint: ${supabaseUrl}/rest/v1/`);
      console.log(` - HTTP Status: ${pingRes.status} ${pingRes.statusText}`);

      if (pingRes.ok) {
        console.log(' - REST API Access: ✅ SUCCESS');
      } else {
        console.log(` - Note: Returned status ${pingRes.status}. (If using RLS or Prisma-only architecture, Postgres connection above is primary).`);
      }
    } catch (e: any) {
      console.error(' - REST API Fetch Error:', e.message);
    }
  }

  console.log('\n==================================================');
  await prisma.$disconnect();
  process.exit(0);
}

runAudit();
