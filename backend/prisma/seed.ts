import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  // delete old data
  await db.categoryTranslation.deleteMany();
  await db.category.deleteMany();
  await db.locale.deleteMany();

  // setup locales
  await db.locale.createMany({
    data: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'sk',
        name: 'Slovenský',
      },
    ],
  });

  const [en, sk] = (await db.locale.findMany()).sort();

  const regenerationCategory = await db.category.create({
    data: {
      slug: 'regeneration',
      CategoryTranslation: {
        createMany: {
          data: [
            {
              name: 'Regeneration',
              description: 'Supplements that help with regeneration.',
              localeId: en.id,
            },
            {
              name: 'Regenerácia',
              description: 'Doplnky zlepšujúce regeneráciu.',
              localeId: sk.id,
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
                localeId: en.id,
              },
              {
                name: 'Kreatín',
                description:
                  'Kreatín je jeden z najviac študovaných suplementov na svete.',
                localeId: sk.id,
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
                localeId: en.id,
              },
              {
                name: 'Proteíny',
                description:
                  'Dostatok bielkovín za deň môže výrazne zlepšiť vašu regeneráciu.',
                localeId: sk.id,
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
