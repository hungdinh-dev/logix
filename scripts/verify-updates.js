const service = require('./sheets-service.js');

async function verifyUpdates() {
  const token = await service.getAccessToken();
  
  // Verify Horeca LMS
  const resHoreca = await fetch('https://sheets.googleapis.com/v4/spreadsheets/12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4/values/Horeca%20LMS!A1:M100', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const dataHoreca = await resHoreca.json();
  const rowsHoreca = dataHoreca.values || [];
  console.log('=== HORECA LMS VERIFICATION ===');
  console.log('Total rows:', rowsHoreca.length);
  console.log('Row 7 [LMS-006]:', rowsHoreca[6][0], '|', rowsHoreca[6][4], '| Phase:', rowsHoreca[6][7], '| BE:', rowsHoreca[6][9], '| FE:', rowsHoreca[6][10], '| All:', rowsHoreca[6][11]);
  console.log('Row 9 [LMS-001]:', rowsHoreca[8][0], '|', rowsHoreca[8][4]);
  console.log('Row 33 [LMS-025]:', rowsHoreca[32][0], '|', rowsHoreca[32][4], '| Phase:', rowsHoreca[32][7], '| BE:', rowsHoreca[32][9]);
  console.log('--- New Rows in Horeca (Rows 70 to 77) ---');
  for (let r = 69; r < rowsHoreca.length; r++) {
    console.log(`Row ${r + 1} [${rowsHoreca[r][0]}]: ${rowsHoreca[r][4]} | Phase: ${rowsHoreca[r][7]} | BE: ${rowsHoreca[r][9]} | FE: ${rowsHoreca[r][10]} | All: ${rowsHoreca[r][11]}`);
  }

  // Verify BaHung LMS
  const resBahung = await fetch('https://sheets.googleapis.com/v4/spreadsheets/12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4/values/BaHung%20LMS!A1:N150', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const dataBahung = await resBahung.json();
  const rowsBahung = dataBahung.values || [];
  console.log('\n=== BAHUNG LMS VERIFICATION ===');
  console.log('Total rows:', rowsBahung.length);
  console.log('Row 4 [LMS-003]:', rowsBahung[3][0], '|', rowsBahung[3][4], '| Phase:', rowsBahung[3][7], '| BE:', rowsBahung[3][9], '| Test:', rowsBahung[3][12]);
  console.log('Row 8 [LMS-007]:', rowsBahung[7][0], '|', rowsBahung[7][4], '| Phase:', rowsBahung[7][7], '| BE:', rowsBahung[7][9], '| Test:', rowsBahung[7][12]);
  console.log('Row 54 [LMS-053]:', rowsBahung[53][0], '|', rowsBahung[53][4], '| Phase:', rowsBahung[53][7], '| BE:', rowsBahung[53][9]);
  console.log('Row 98 [LMS-097]:', rowsBahung[97][0], '|', rowsBahung[97][4], '| Phase:', rowsBahung[97][7], '| BE:', rowsBahung[97][9], '| Test:', rowsBahung[97][12]);
  console.log('--- New Rows in BaHung (Rows 113 to 122) ---');
  for (let r = 112; r < rowsBahung.length; r++) {
    console.log(`Row ${r + 1} [${rowsBahung[r][0]}]: ${rowsBahung[r][4]} | Phase: ${rowsBahung[r][7]} | BE: ${rowsBahung[r][9]} | Test: ${rowsBahung[r][12]}`);
  }
}
verifyUpdates();
