const fs = require('fs');
const path = require('path');

const modules = [
  'companies', 'departments', 'users', 'roles', 'jobs', 'skills',
  'candidates', 'resumes', 'applications', 'screenings', 'interviews', 'notifications'
];

const basePath = path.join(__dirname, '../src/modules');

modules.forEach(mod => {
  const modDir = path.join(basePath, mod);
  if (!fs.existsSync(modDir)) {
    fs.mkdirSync(modDir, { recursive: true });
  }

  const className = mod.charAt(0).toUpperCase() + mod.slice(1) + 'Module';
  const content = `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class ${className} {}
`;

  const filePath = path.join(modDir, `${mod}.module.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
});
