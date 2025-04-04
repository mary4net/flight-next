import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  const hotelOwners = await Promise.all([
    prisma.user.create({
      data: {
        firstName: "Yoyo",
        lastName: "Li",
        email: "yoyo@example.com",
        password: "111",
        role: "HOTEL_OWNER",
        phoneNumber: "2897728561",
        profilePicture: 'https://images.pexels.com/photos/735277/pexels-photo-735277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
    }),
    prisma.user.create({
      data: {
        firstName: "Mary",
        lastName: "Xu",
        email: "mary@example.com",
        password: "222",
        role: "HOTEL_OWNER",
        phoneNumber: "1234567890",
        profilePicture: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
    }),
    prisma.user.create({
      data: {
        firstName: "Kimberley",
        lastName: "Michela",
        email: "kimberly@example.com",
        password: "333",
        role: "HOTEL_OWNER",
        phoneNumber: "1234567890",
        profilePicture: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
    }),
  ]);

  const ownerIds = hotelOwners.map((owner) => owner.id);
  const cities = ["Toronto", "Vancouver", "New York", "Saskatoon", "Tokyo", "Oslo", "Narita", "Shanghai", "Beijing", "Seoul", "London", "Paris", "Madrid", "Rome", "Amsterdam", "Brussels", "Zurich", "Vienna", "Copenhagen", "Colombo", "Edmonton", "Moscow", "Sydney", "Dallas", "Guangzhou"];
  for (let i = 0; i < 60; i++) {
    await prisma.hotel.create({
      data: {
        name: `Hotel ${i + 1}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        starRating: Math.floor(Math.random() * 5) + 1,
        address: `${i + 1} Main Street`,
        ownerId: ownerIds[Math.floor(Math.random() * ownerIds.length)],
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2']
      }
    });
  }
}

main()
  .then(() => {
    console.log('Database seeded.');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });