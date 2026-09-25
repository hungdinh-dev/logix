const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SPREADSHEET_ID = '1Iwjkuvwx2EF4r5XoHpZgOaN4K5OAEKfiFi-hrE2Z_ec';
const KEY_FILE = path.resolve(__dirname, '../lms-list-functions-a6929ed66987.json');

const credentials = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));

function createJWT() {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = encodedHeader + '.' + encodedPayload;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(credentials.private_key, 'base64url');
  return signatureInput + '.' + signature;
}

async function run() {
  const jwt = createJWT();
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('Token error:', tokenData);
    return;
  }
  console.log('✅ Access token obtained successfully!');

  // Get spreadsheet metadata
  const metaRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID, {
    headers: { Authorization: 'Bearer ' + tokenData.access_token }
  });
  const meta = await metaRes.json();
  if (meta.error) {
    console.error('Spreadsheet error:', meta.error);
    return;
  }
  console.log('✅ Spreadsheet Title:', meta.properties.title);
  console.log('Tabs / Sheets count:', meta.sheets.length);
  meta.sheets.forEach((s) => {
    console.log(' - Tab:', s.properties.title, '| gid / sheetId:', s.properties.sheetId);
  });

  // Read first sheet values
  const firstTab = meta.sheets[0].properties.title;
  const valuesRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + encodeURIComponent(firstTab), {
    headers: { Authorization: 'Bearer ' + tokenData.access_token }
  });
  const valuesData = await valuesRes.json();
  console.log('Values in tab "' + firstTab + '":', valuesData.values ? valuesData.values.length + ' rows' : 'EMPTY');
  if (valuesData.values && valuesData.values.length > 0) {
    console.log('Row 1 (Header):', valuesData.values[0]);
    if (valuesData.values[1]) {
      console.log('Row 2 (First Data):', valuesData.values[1]);
    }
  }
}

run().catch(console.error);
