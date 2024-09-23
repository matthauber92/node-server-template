import {Prisma} from '@prisma/client';
import {
  randNumber,
  randEmail,
  randFirstName,
  randLastName,
  randUserName,
  randPassword
} from '@ngneat/falso';
import {prisma} from '../src/db';
import bcrypt from 'bcrypt';

async function seedUsers(): Promise<void> {
  const userData: Prisma.UserCreateManyInput[] = await Promise.all(
    Array.from({length: randNumber({min: 200, max: 300})}, async () => {
      const hashedPassword = await bcrypt.hash(randPassword(), 10);

      return {
        username: randUserName(),
        password: hashedPassword, // Store hashed password
        email: randEmail(),
        firstName: randFirstName(),
        lastName: randLastName(),
      };
    }),
  );

  try {
    const usersCreateResult = await prisma.user.createMany({data: userData});
    console.log(`Created ${usersCreateResult.count} users`);
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

async function main() {
  console.log('Start seeding ...');
  console.time('full seed');

  await seedUsers();

  console.timeLog('full seed');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
