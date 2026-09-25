const fs = require('fs');

const horeca = JSON.parse(fs.readFileSync('horeca_lms_full.json', 'utf8'));
const bahung = JSON.parse(fs.readFileSync('bahung_lms_full.json', 'utf8'));

let outHoreca = '=== HORECA LMS ALL ROWS ===\n';
horeca.forEach((r, idx) => {
  if (idx === 0) return;
  outHoreca += `Row ${idx + 1} | Code: ${r[0] || ''} | Domain: ${r[2] || ''} | Sub: ${r[3] || ''} | Name: ${r[4] || ''} | Phase: ${r[7] || ''} | BE: ${r[9] || ''} | FE: ${r[10] || ''} | All: ${r[11] || ''}\n`;
});
fs.writeFileSync('horeca_summary.txt', outHoreca, 'utf8');

let outBahung = '=== BAHUNG LMS ALL ROWS ===\n';
bahung.forEach((r, idx) => {
  if (idx === 0) return;
  outBahung += `Row ${idx + 1} | Code: ${r[0] || ''} | Domain: ${r[2] || ''} | Sub: ${r[3] || ''} | Name: ${r[4] || ''} | Phase: ${r[7] || ''} | BE: ${r[9] || ''} | FE: ${r[10] || ''} | All: ${r[11] || ''} | Test: ${r[12] || ''}\n`;
});
fs.writeFileSync('bahung_summary.txt', outBahung, 'utf8');

console.log('Wrote horeca_summary.txt and bahung_summary.txt');
