const http = require('http');

async function checkInfrastructure() {
  console.log('====================================================');
  console.log('   AI RECRUITMENT SYSTEM - INFRASTRUCTURE HEALTH    ');
  console.log('====================================================\n');

  const backendHealthUrl = 'http://localhost:3001/api/health';

  http.get(backendHealthUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`Overall Status: ${json.status}\n`);
        console.log('Subsystem Breakdown:');
        console.dir(json.services, { depth: null });
      } catch (err) {
        console.log('Failed to parse backend health response.');
        console.log(data);
      }
    });
  }).on('error', (err) => {
    console.log('Status: DEGRADED / OFFLINE');
    console.log('NestJS Backend is not running at http://localhost:3001/api/health');
    console.log(`Connection error: ${err.message}`);
  });
}

checkInfrastructure();
