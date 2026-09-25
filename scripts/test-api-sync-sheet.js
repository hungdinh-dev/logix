const API_BASE = 'http://localhost:5000';
const jwt = require('../backend/node_modules/jsonwebtoken');
const TOKEN = jwt.sign(
  {
    userId: '9dd85232-bf93-32b1-7e2d-3aae9187b565',
    userAccountId: '9a5a8fce-1f17-4857-9695-dd05a763d75e',
    email: 'admin@gmail.com',
    role: 'ADMIN',
  },
  'super_secret_key',
  { expiresIn: '1d' }
);
const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function run() {
  console.log('1. Getting list of banks...');
  const listRes = await fetch(`${API_BASE}/api/question-banks`, { headers: AUTH_HEADERS });
  const listData = await listRes.json();
  const banks = listData.data?.items || [];
  console.log(`Found ${banks.length} banks.`);

  let targetBank = banks.find(b => b.code === 'QB_JS_ADVANCED' || b.code === 'QB_JS_TEST');
  if (!targetBank && banks.length > 0) {
    targetBank = banks[0];
  }

  if (!targetBank) {
    console.log('No bank found, creating a new test bank...');
    const createRes = await fetch(`${API_BASE}/api/question-banks`, {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({
        code: 'QB_JS_ADVANCED',
        name: 'Ngân hàng Lập trình JavaScript Chuyên Sâu',
        googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1Iwjkuvwx2EF4r5XoHpZgOaN4K5OAEKfiFi-hrE2Z_ec/edit?gid=0#gid=0'
      })
    });
    const createData = await createRes.json();
    targetBank = createData.data;
    console.log('Created bank:', targetBank.id, targetBank.name);
  } else {
    console.log('Target bank:', targetBank.id, targetBank.name);
  }

  console.log('\n2. Testing 1-Click Sync from Google Sheet (Tab JavaScript_Core gid=0)...');
  const syncRes = await fetch(`${API_BASE}/api/question-banks/${targetBank.id}/sync-sheet`, {
    method: 'POST',
    headers: AUTH_HEADERS,
    body: JSON.stringify({
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1Iwjkuvwx2EF4r5XoHpZgOaN4K5OAEKfiFi-hrE2Z_ec/edit?gid=0#gid=0'
    })
  });
  const syncData = await syncRes.json();
  console.log('Sync HTTP Status:', syncRes.status);
  console.log('Sync Response Message:', syncData.data?.message || syncData.message);
  console.log('Sync Stats:', syncData.data?.stats);
  console.log('Added count:', syncData.data?.addedQuestions?.length);
  console.log('Updated count:', syncData.data?.updatedQuestions?.length);
  console.log('Deactivated count:', syncData.data?.deactivatedQuestions?.length);
  console.log('Errors:', syncData.data?.syncErrors);

  console.log('\n3. Verifying updated question bank details...');
  const detailRes = await fetch(`${API_BASE}/api/question-banks/${targetBank.id}`, { headers: AUTH_HEADERS });
  const detailData = await detailRes.json();
  console.log('Bank total questions in DB:', detailData.data?.totalQuestions);
  console.log('Bank last synced at:', detailData.data?.lastSyncedAt);

  console.log('\n4. Checking sys_audit_logs for this sync...');
  const auditRes = await fetch(`${API_BASE}/api/audit-logs/entity/quiz_question_banks/${targetBank.id}`, { headers: AUTH_HEADERS });
  const auditData = await auditRes.json();
  const logs = auditData.data?.items || auditData.data || [];
  console.log(`Audit log records count: ${logs.length}`);
  if (logs.length > 0) {
    const latest = logs[0];
    console.log('Latest Audit Log:');
    console.log(' - Action:', latest.action);
    console.log(' - Summary (newValue):', latest.newValue);
    console.log(' - CreatedAt:', latest.createdAt);
  }
}

run().catch(console.error);
