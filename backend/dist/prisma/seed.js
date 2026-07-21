"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    const roles = [
        { code: 'ADMIN', name: 'Administrator', description: 'System Administrator' },
        { code: 'RECRUITER', name: 'Recruiter', description: 'HR / Recruitment Staff' },
        { code: 'CANDIDATE', name: 'Candidate', description: 'Job Applicant' },
    ];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {},
            create: role,
        });
    }
    console.log(`Seeded ${roles.length} roles.`);
    const company = await prisma.company.upsert({
        where: { code: 'ABC' },
        update: {},
        create: {
            name: 'Công ty ABC',
            code: 'ABC',
            website: 'https://abc.com',
            description: 'Công ty công nghệ hàng đầu',
        },
    });
    console.log(`Seeded company: ${company.name}`);
    const departments = [
        { code: 'HR', name: 'Human Resources', companyId: company.id, status: client_1.DepartmentStatus.ACTIVE },
        { code: 'IT', name: 'Information Technology', companyId: company.id, status: client_1.DepartmentStatus.ACTIVE },
        { code: 'MKT', name: 'Marketing', companyId: company.id, status: client_1.DepartmentStatus.ACTIVE },
        { code: 'SALES', name: 'Sales', companyId: company.id, status: client_1.DepartmentStatus.ACTIVE },
        { code: 'FIN', name: 'Finance', companyId: company.id, status: client_1.DepartmentStatus.ACTIVE },
    ];
    for (const dept of departments) {
        await prisma.department.upsert({
            where: { code: dept.code },
            update: {},
            create: dept,
        });
    }
    console.log(`Seeded ${departments.length} departments.`);
    const skillsData = [
        { name: 'React', normalizedName: 'react', category: 'Frontend', status: client_1.SkillStatus.ACTIVE },
        { name: 'Node.js', normalizedName: 'node.js', category: 'Backend', status: client_1.SkillStatus.ACTIVE },
        { name: 'Python', normalizedName: 'python', category: 'Backend/AI', status: client_1.SkillStatus.ACTIVE },
        { name: 'Java', normalizedName: 'java', category: 'Backend', status: client_1.SkillStatus.ACTIVE },
        { name: 'SQL', normalizedName: 'sql', category: 'Database', status: client_1.SkillStatus.ACTIVE },
        { name: 'TypeScript', normalizedName: 'typescript', category: 'Language', status: client_1.SkillStatus.ACTIVE },
        { name: 'AWS', normalizedName: 'aws', category: 'Cloud', status: client_1.SkillStatus.ACTIVE },
        { name: 'Docker', normalizedName: 'docker', category: 'DevOps', status: client_1.SkillStatus.ACTIVE },
        { name: 'Kubernetes', normalizedName: 'kubernetes', category: 'DevOps', status: client_1.SkillStatus.ACTIVE },
        { name: 'Communication', normalizedName: 'communication', category: 'Soft Skill', status: client_1.SkillStatus.ACTIVE },
        { name: 'Leadership', normalizedName: 'leadership', category: 'Soft Skill', status: client_1.SkillStatus.ACTIVE },
    ];
    const skillRecords = [];
    for (const skill of skillsData) {
        const record = await prisma.skill.upsert({
            where: { normalizedName: skill.normalizedName },
            update: {},
            create: skill,
        });
        skillRecords.push(record);
    }
    console.log(`Seeded ${skillRecords.length} skills.`);
    const skillAliasesData = [
        { skillNormalized: 'react', alias: 'reactjs' },
        { skillNormalized: 'react', alias: 'react.js' },
        { skillNormalized: 'node.js', alias: 'nodejs' },
        { skillNormalized: 'node.js', alias: 'node' },
        { skillNormalized: 'typescript', alias: 'ts' },
    ];
    let aliasCount = 0;
    for (const item of skillAliasesData) {
        const skill = skillRecords.find(s => s.normalizedName === item.skillNormalized);
        if (skill) {
            await prisma.skillAlias.upsert({
                where: { aliasName: item.alias },
                update: {},
                create: {
                    aliasName: item.alias,
                    skillId: skill.id,
                },
            });
            aliasCount++;
        }
    }
    console.log(`Seeded ${aliasCount} skill aliases.`);
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map