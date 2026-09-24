const fs = require('fs');

const horeca = JSON.parse(fs.readFileSync('horeca_lms_full.json', 'utf8'));
const bahung = JSON.parse(fs.readFileSync('bahung_lms_full.json', 'utf8'));

console.log('=== HORECA LMS (' + horeca.length + ' rows) ===');
horeca.forEach((r, idx) => {
  if (idx === 0) return;
  console.log(`[R${idx + 1}] [${r[0] || ''}] ${r[4] || ''} | Dom: ${r[2] || ''} > ${r[3] || ''} | Phase: ${r[7] || ''} | BE: ${r[9] || ''} | FE: ${r[10] || ''} | All: ${r[11] || ''}`);
});

console.log('\n=== BAHUNG LMS (' + bahung.length + ' rows) ===');
bahung.forEach((r, idx) => {
  if (idx === 0) return;
  console.log(`[R${idx + 1}] [${r[0] || ''}] ${r[4] || ''} | Dom: ${r[2] || ''} > ${r[3] || ''} | Phase: ${r[7] || ''} | BE: ${r[9] || ''} | FE: ${r[10] || ''} | All: ${r[11] || ''} | Test: ${r[12] || ''}`);
});
