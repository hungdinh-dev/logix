const sheetsService = require('./sheets-service');

async function main() {
  const tasks = await sheetsService.getSprintTasks('Horeca LMS', 1);
  console.log(JSON.stringify(tasks, null, 2));
}

main().catch(console.error);
