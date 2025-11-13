/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from 'generated/prisma/client';
import { Locales } from 'src/locales';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import fs from 'fs';

const db = new PrismaClient();
const prismaService = new PrismaService();
const userService = new UsersService(prismaService);

async function main() {
  // delete old data
  await db.productTranslation.deleteMany();
  await db.productImage.deleteMany();
  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.attributeTranslation.deleteMany();
  await db.attribute.deleteMany();
  await db.attributeKeyTranslation.deleteMany();
  await db.attributeKey.deleteMany();
  await db.categoryTranslation.deleteMany();
  await db.category.deleteMany();
  await db.refreshTokenSession.deleteMany();
  await db.user.deleteMany();

  // create new users
  const createdUser = await userService.create({
    email: 'email@admin.com',
    name: 'Admin',
    lastName: 'Admin',
    password: '123',
    confirmPassword: '123',
  });

  await prismaService.user.update({
    where: {
      id: createdUser.id,
    },
    data: {
      role: 'ADMIN',
    },
  });

  // get locales
  const { english, slovak } = Locales;

  // create attribute keys
  const aColorKey = await db.attributeKey.create({
    data: {
      key: 'color',
      Translations: {
        createMany: {
          data: [
            {
              keyTranslation: 'colour',
              locale: english.code,
            },
            {
              keyTranslation: 'farba',
              locale: slovak.code,
            },
          ],
        },
      },
    },
  });

  const aWeightKey = await db.attributeKey.create({
    data: {
      key: 'weight',
      Translations: {
        createMany: {
          data: [
            {
              keyTranslation: 'weight',
              locale: english.code,
            },
            {
              keyTranslation: 'hmotnosť',
              locale: slovak.code,
            },
          ],
        },
      },
    },
  });

  const regenerationCategory = await db.category.create({
    data: {
      slug: 'regeneration',
      isSetup: true,
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

  const creatineCategory = await db.category.create({
    data: {
      slug: 'creatine',
      isSetup: true,
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
  });

  // create products for creatine category
  const creatineMonohydrate = await db.product.create({
    data: {
      slug: 'creatine-monohydrate',
      Category: {
        connect: {
          id: creatineCategory.id,
        },
      },
      isPublic: true,
      ProductTranslations: {
        createMany: {
          data: [
            {
              locale: english.code,
              name: 'Creatine Monohydrate',
              description: 'Most popular form of creatine',
              markdownContent: fs.readFileSync(
                __dirname + '/data/content/creatine-monohydrate.en.md',
                'utf8',
              ),
            },
            {
              locale: slovak.code,
              name: 'Kreatín Monohydrát',
              description: 'Najpopulárnejšia forma kreatínu',
              markdownContent: fs.readFileSync(
                __dirname + '/data/content/creatine-monohydrate.sk.md',
                'utf8',
              ),
            },
          ],
        },
      },
      Images: {
        createMany: {
          data: [
            {
              isThumbnail: true,
              base64: encodeToBase64(
                __dirname + '/data/images/creatine-monohydrate-1.jpg',
              ),
              mimeType: 'image/jpg',
            },
          ],
        },
      },
    },
  });

  const creatineGummies = await db.product.create({
    data: {
      slug: 'creatine-gummies',
      Category: {
        connect: {
          id: creatineCategory.id,
        },
      },
      isPublic: true,
      ProductTranslations: {
        createMany: {
          data: [
            {
              locale: english.code,
              name: 'Creatine Gummies',
              description:
                'Packed with 5g of pure creatine per serving, these convenient, delicious gummies support muscle growth, improve strength, and enhance workout performance. No mixing, no mess—just pop, chew, and fuel your fitness goals. Perfect for busy days or on-the-go athletes!',
              markdownContent: fs.readFileSync(
                __dirname + '/data/content/creatine-gummies.en.md',
                'utf8',
              ),
            },
            {
              locale: slovak.code,
              name: 'Kreatín Monohydrát',
              description:
                'S obsahom 5g kreatínu, tieto praktické a chutné gumy podporujú rast svalov, zlepšujú silu a zvyšujú výkon počas tréningu. Žiadne miešanie, žiadny neporiadok - jednoducho zjedz, žuj a poháňaj svoje fitness ciele. Ideálne pre rušné dni alebo športovcov na cestách!',
              markdownContent: fs.readFileSync(
                __dirname + '/data/content/creatine-gummies.sk.md',
                'utf8',
              ),
            },
          ],
        },
      },
      Images: {
        createMany: {
          data: [
            {
              isThumbnail: true,
              base64: encodeToBase64(
                __dirname + '/data/images/creatine-monohydrate-gummies-1.jpg',
              ),
              mimeType: 'image/jpg',
            },
          ],
        },
      },
    },
  });

  // create product variants
  const creatineMonohydrate300 = await db.productVariant.create({
    data: {
      Product: {
        connect: {
          id: creatineMonohydrate.id,
        },
      },
      priceInCents: 1500,
      sku: 'creatine-monohydrate-300g',
      stock: 100,
    },
  });

  await db.attribute.create({
    data: {
      AttributeKey: {
        connect: {
          id: aWeightKey.id,
        },
      },
      ProductVariant: {
        connect: {
          id: creatineMonohydrate300.id,
        },
      },
      AttributeTranslations: {
        createMany: {
          data: [
            {
              value: '300g',
              locale: english.code,
            },
          ],
        },
      },
    },
  });

  const creatineMonohydrate1000 = await db.productVariant.create({
    data: {
      Product: {
        connect: {
          id: creatineMonohydrate.id,
        },
      },
      priceInCents: 4000,
      sku: 'creatine-monohydrate-1000g',
      stock: 100,
    },
  });

  const creatineGummies500 = await db.productVariant.create({
    data: {
      priceInCents: 2499,
      sku: 'creatine-gummies-500g',
      stock: 100,
      Product: {
        connect: {
          id: creatineGummies.id,
        },
      },
    },
  });

  await db.attribute.create({
    data: {
      AttributeKey: {
        connect: {
          id: aWeightKey.id,
        },
      },
      ProductVariant: {
        connect: {
          id: creatineMonohydrate1000.id,
        },
      },
      AttributeTranslations: {
        createMany: {
          data: [
            {
              value: '1000g',
              locale: english.code,
            },
          ],
        },
      },
    },
  });

  await db.attribute.create({
    data: {
      AttributeKey: {
        connect: {
          id: aWeightKey.id,
        },
      },
      ProductVariant: {
        connect: {
          id: creatineGummies500.id,
        },
      },
      AttributeTranslations: {
        create: {
          locale: english.code,
          value: '500g',
        },
      },
    },
  });

  const proteinCategory = await db.category.create({
    data: {
      slug: 'protein',
      isSetup: true,
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
  });
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

function encodeToBase64(file: string) {
  return fs.readFileSync(file, { encoding: 'base64' });
}
