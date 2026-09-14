/**
 * Google Sheets Integration Service for LogiX LMS
 * Directly reads and syncs tasks/functions from Google Sheets
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SPREADSHEET_ID = '12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4';
const KEY_FILE = path.resolve(__dirname, '../lms-list-functions-a6929ed66987.json');

class GoogleSheetsService {
  constructor() {
    this.credentials = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  createJWT() {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    const signature = signer.sign(this.credentials.private_key, 'base64url');
    return `${signatureInput}.${signature}`;
  }

  async getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (this.accessToken && this.tokenExpiry > now + 60) {
      return this.accessToken;
    }
    const jwt = this.createJWT();
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(`Google Auth Failed: ${data.error_description || data.error}`);
    }
    this.accessToken = data.access_token;
    this.tokenExpiry = now + data.expires_in;
    return this.accessToken;
  }

  async fetchTab(tabName) {
    const token = await this.getAccessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(tabName)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(`Google Sheets API Error: ${data.error.message}`);
    }
    return data.values || [];
  }

  async getSprintTasks(tabName, sprintNumber = 1) {
    const rows = await this.fetchTab(tabName);
    if (!rows || rows.length < 2) return [];

    const header = rows[0].map(h => String(h || '').trim().toLowerCase());
    
    // Find column indexes
    const idxCode = header.findIndex(h => h.includes('mã') || h.includes('ma_cn') || h.includes('code'));
    const idxName = header.findIndex(h => h.includes('tên chức năng') || h.includes('ten_chuc_nang') || h.includes('name'));
    const idxModule = header.findIndex(h => h.includes('nghiệp vụ lớn') || h.includes('module') || h.includes('domain'));
    const idxGroup = header.findIndex(h => h.includes('nghiệp vụ con') || h.includes('nhóm') || h.includes('nhom'));
    const idxDesc = header.findIndex(h => h.includes('mô tả') || h.includes('mo_ta'));
    const idxRole = header.findIndex(h => h.includes('đối tượng') || h.includes('doi_tuong'));
    const idxPhase = header.findIndex(h => h.includes('giai đoạn') || h.includes('giai_doan') || h.includes('phase') || h.includes('sprint'));
    const idxDiff = header.findIndex(h => h.includes('độ khó') || h.includes('do_kho') || h.includes('ưu tiên'));
    const idxNote = header.findIndex(h => h.includes('ghi chú') || h.includes('ghi_chu') || h.includes('note'));

    const sprintStr = String(sprintNumber).toLowerCase();
    const tasks = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;

      const phaseVal = idxPhase !== -1 ? String(r[idxPhase] || '').trim() : '';
      const isSprintMatch = 
        phaseVal === sprintStr ||
        phaseVal.toLowerCase().includes(`phase ${sprintStr}`) ||
        phaseVal.toLowerCase().includes(`sprint ${sprintStr}`) ||
        phaseVal.toLowerCase().includes(`giai đoạn ${sprintStr}`) ||
        (sprintStr === '1' && phaseVal.toLowerCase().includes('ưu tiên phase 1'));

      if (isSprintMatch) {
        tasks.push({
          rowNumber: i + 1,
          code: idxCode !== -1 ? r[idxCode] : r[0],
          module: idxModule !== -1 ? r[idxModule] : '',
          group: idxGroup !== -1 ? r[idxGroup] : '',
          name: idxName !== -1 ? r[idxName] : '',
          desc: idxDesc !== -1 ? r[idxDesc] : '',
          role: idxRole !== -1 ? r[idxRole] : '',
          phase: phaseVal,
          difficulty: idxDiff !== -1 ? r[idxDiff] : '',
          note: idxNote !== -1 ? r[idxNote] : ''
        });
      }
    }

    return tasks;
  }
}

module.exports = new GoogleSheetsService();

// CLI execution demo
if (require.main === module) {
  (async () => {
    const service = new GoogleSheetsService();
    console.log('--- Fetching Horeca LMS Sprint 1 Tasks ---');
    const tasks = await service.getSprintTasks('Horeca LMS', 1);
    console.log(`Found ${tasks.length} tasks in Sprint 1.`);
    tasks.slice(0, 10).forEach((t, i) => {
      console.log(`${i + 1}. [${t.code}] ${t.name} (${t.module} > ${t.group}) - Role: ${t.role}`);
    });
  })();
}
