import { Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import {
  randNumber,
  randEmail,
  randFirstName,
  randLastName,
  randUserName,
  randPassword
} from '@ngneat/falso'
import { prisma } from '../src/db'

async function seedUsers(): Promise<void> {
  const userData: Prisma.UserCreateManyInput[] = Array.from(
    { length: randNumber({ min: 200, max: 300 }) },
    () => {
      return {
        userId: uuidv4(),
        username: randUserName(),
        password: randPassword(),
        email: randEmail(),
        firstName: randFirstName(),
        lastName: randLastName(),
      }
    },
  )

  const usersCreateResult = await prisma.user.createMany({ data: userData })

  console.log(`Created ${usersCreateResult.count} users`)
}
async function main() {
  console.log(`Start seeding ...`)
  console.time(`full seed`)

  await seedUsers()

  console.timeLog(`full seed`)

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
