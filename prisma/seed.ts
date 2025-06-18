import { PrismaClient } from '@prisma/client';

// instantiate PrismaClient
const prisma = new PrismaClient();

async function main() {
  // Define seed data
  const users = [
    {
      firstName: 'amit',
      lastName: 'admin',
      email: 'amittest@gmail.com',
      password: 'password123',
      // role: '',
    },
    {
      firstName: 'amit',
      lastName: 'editor',
      email: 'amiteditor@gmail.com',
      password: 'password123',
      // role: '',
    },
    {
      firstName: 'amit',
      lastName: 'viewer',
      email: 'amitviewer@gmail.com',
      password: 'password123',
      // role: '',
    },
  ];

  // Insert seed data
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('Seed data inserted successfully');
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })

  // Close PrismaClient
  .finally(async () => {
    await prisma.$disconnect();
  });
