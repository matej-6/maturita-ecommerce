import { PrismaClient } from 'generated/prisma/client';
import { Locales } from 'src/locales';

const db = new PrismaClient();

async function main() {
  // delete old data
  await db.categoryTranslation.deleteMany();
  await db.category.deleteMany();

  // get locales
  const { english, slovak } = Locales;

  const regenerationCategory = await db.category.create({
    data: {
      slug: 'regeneration',
      CategoryTranslation: {
        createMany: {
          data: [
            {
              name: 'Regeneration',
              description: 'Supplements that help with regeneration.',
              locale: english.code,
            },
            {
              name: 'Regenerácia',
              description: 'Doplnky zlepšujúce regeneráciu.',
              locale: slovak.code,
            },
          ],
        },
      },
    },
  });

  // create supplements in 'regeneration' category
  await Promise.all([
    db.category.create({
      data: {
        slug: 'creatine',
        parentCategory: {
          connect: {
            id: regenerationCategory.id,
          },
        },
        CategoryTranslation: {
          createMany: {
            data: [
              {
                name: 'Creatine',
                description:
                  "Creatine is one of the world's most researched supplements",
                locale: english.code,
              },
              {
                name: 'Kreatín',
                description:
                  'Kreatín je jeden z najviac študovaných suplementov na svete.',
                locale: slovak.code,
              },
            ],
          },
        },
      },
    }),
    db.category.create({
      data: {
        slug: 'protein',
        parentCategory: {
          connect: {
            id: regenerationCategory.id,
          },
        },
        CategoryTranslation: {
          createMany: {
            data: [
              {
                name: 'Protein',
                description:
                  'Protein plays a key role in regeneration because it is the building block of new muscle tissue, therefore eating more protein throughout the day can significantly help with regeneration.',
                locale: english.code,
              },
              {
                name: 'Proteíny',
                description:
                  'Dostatok bielkovín za deň môže výrazne zlepšiť vašu regeneráciu.',
                locale: slovak.code,
              },
            ],
          },
        },
      },
    }),
  ]);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
