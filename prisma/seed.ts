import { prisma } from '../src/lib/prisma.js';


await prisma.sanctionedPerson.createMany({
    data: [
        { name: 'William Nibodeau', dateOfBirth: new Date(Date.UTC(1983, 11, 19)) },
        { name: 'Jacques Bret', dateOfBirth: new Date(Date.UTC(1999, 1, 20)) },
    ],
});

console.log('Seed data created.');
await prisma.$disconnect();