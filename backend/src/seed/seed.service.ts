import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { faker, fakerSK } from '@faker-js/faker';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly userService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly attributesService: ProductVariantAttributesService,
    private readonly attributeKeysService: ProductVariantAttributeKeysService,
    private readonly localesService: LocalesService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly qdrantService: QdrantService,
    private readonly llmService: LLMPromptsService,
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {}

  onModuleInit() {
    this.logger.log('Seeding started...');
  }

  private async clearDatabase() {
    this.logger.log('Clearing database...');
    await this.prismaService.attribute.deleteMany();
    await this.prismaService.attributeKey.deleteMany();
    await this.prismaService.lLMTask.deleteMany();
    await this.prismaService.productVariant.deleteMany();
    await this.prismaService.product.deleteMany();
    await this.prismaService.productReview.deleteMany();
    await this.prismaService.category.deleteMany();
    await this.prismaService.user.deleteMany();
    await this.llmService.clearLlmTasksQueue();
    await this.qdrantService.clearProductCollections();
    this.logger.log('Database cleared.');
  }

  private async seedUsers() {
    this.logger.log('Seeding users...');
    const users = [
      {
        email: 'matejbarca2006@gmail.com',
        password: '123123123',
        confirmPassword: '123123123',
        name: 'Matej',
        lastName: 'Barca',
        role: 'ADMIN',
      },
      {
        email: fakerSK.internet.email(),
        password: '123123123',
        confirmPassword: '123123123',
        name: fakerSK.person.firstName(),
        lastName: fakerSK.person.lastName(),
        role: 'USER',
      },
      {
        email: fakerSK.internet.email(),
        password: '123123123',
        confirmPassword: '123123123',
        name: fakerSK.person.firstName(),
        lastName: fakerSK.person.lastName(),
        role: 'USER',
      },
    ];

    for (const userData of users) {
      this.logger.log(`Seeding user: ${userData.email}`);
      const createdUser = await this.userService.create({
        ...userData,
      });
      if (userData.role === 'ADMIN') {
        await this.prismaService.user.update({
          where: { id: createdUser.id },
          data: { role: 'ADMIN' },
        });
      }
    }
    this.logger.log('Users seeded.');
  }

  async seed(skipLLMTasks = false) {
    await this.clearDatabase();
    await this.seedUsers();
    this.logger.log('Seeding attribute keys...');
    const colorKey = await this.attributeKeysService.create({
      key: 'color',
    });

    await this.attributeKeysService.createTranslation({
      keyId: colorKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'colour',
    });

    await this.attributeKeysService.createTranslation({
      keyId: colorKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'farba',
    });

    const weightKey = await this.attributeKeysService.create({
      key: 'weight',
    });

    await this.attributeKeysService.createTranslation({
      keyId: weightKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'weight',
    });

    await this.attributeKeysService.createTranslation({
      keyId: weightKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'hmotnosť',
    });

    this.logger.log('Seeding categories...');
    const regenerationCategory = await this.categoriesService.create({
      slug: 'regeneration',
    });

    await this.categoriesService.createTranslation(regenerationCategory.id, {
      categoryId: regenerationCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Regeneration',
      description: 'Supplements that help with regeneration.',
    });

    await this.categoriesService.createTranslation(regenerationCategory.id, {
      categoryId: regenerationCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Regenerácia',
      description: 'Doplnky, ktoré pomáhajú s regeneráciou.',
    });

    const creatineCategory = await this.categoriesService.create({
      slug: 'creatine',
      parentCategoryId: regenerationCategory.id,
    });

    await this.categoriesService.createTranslation(creatineCategory.id, {
      categoryId: creatineCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Creatine',
      description: 'Creatine supplements for muscle growth and performance.',
    });

    await this.categoriesService.createTranslation(creatineCategory.id, {
      categoryId: creatineCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Kreatín',
      description: 'Kreatínové doplnky pre rast svalov a výkon.',
    });

    const proteinCategory = await this.categoriesService.create({
      slug: 'protein',
      parentCategoryId: regenerationCategory.id,
    });

    await this.categoriesService.createTranslation(proteinCategory.id, {
      categoryId: proteinCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Protein',
      description: 'Protein supplements for muscle building and recovery.',
    });

    await this.categoriesService.createTranslation(proteinCategory.id, {
      categoryId: proteinCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Proteín',
      description: 'Proteínové doplnky pre budovanie svalov a regeneráciu.',
    });

    const clothingCategory = await this.categoriesService.create({
      slug: 'clothing',
    });

    await this.categoriesService.createTranslation(clothingCategory.id, {
      categoryId: clothingCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Clothing',
      description: 'Fitness clothing and accessories.',
    });

    await this.categoriesService.createTranslation(clothingCategory.id, {
      categoryId: clothingCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Oblečenie',
      description: 'Fitness oblečenie a doplnky.',
    });

    this.logger.log('Categories seeded.');

    this.logger.log('Seeding products...');
    const creatineMonohydrate = await this.productsService.create({
      slug: 'creatine-monohydrate',
      categoryId: creatineCategory.id,
      isPublic: true,
    });

    await this.productsService.createProductTranslation(
      creatineMonohydrate.id,
      {
        localeCode: this.localesService.locales().english.code,
        name: 'Creatine Monohydrate',
        description: 'Most popular form of creatine supplement.',
        markdownContent: fs.readFileSync(
          __dirname +
            '/../../prisma/seed/data/content/creatine-monohydrate.en.md',
          'utf-8',
        ),
      },
    );

    await this.productsService.createProductTranslation(
      creatineMonohydrate.id,
      {
        localeCode: this.localesService.locales().slovak.code,
        name: 'Kreatín Monohydrát',
        description: 'Najpopulárnejšia forma kreatínového doplnku.',
        markdownContent: fs.readFileSync(
          __dirname +
            '/../../prisma/seed/data/content/creatine-monohydrate.sk.md',
          'utf-8',
        ),
      },
    );

    await this.productsService.addProductImage(creatineMonohydrate.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/creatine-monohydrate-1.png',
      ),
      mimeType: 'image/png',
    });

    await this.productsService.addProductImage(creatineMonohydrate.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/creatine-monohydrate-2.png',
      ),
      mimeType: 'image/png',
    });

    const creatineGummies = await this.productsService.create({
      isPublic: true,
      slug: 'creatine-gummies',
      categoryId: creatineCategory.id,
    });

    await this.productsService.createProductTranslation(creatineGummies.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Creatine Gummies',
      description:
        'Packed with 5g of pure creatine per serving, these convenient, delicious gummies support muscle growth, improve strength, and enhance workout performance. No mixing, no mess—just pop, chew, and fuel your fitness goals. Perfect for busy days or on-the-go athletes!',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/creatine-gummies.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(creatineGummies.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Kreatín Gummies',
      description:
        'S obsahom 5g kreatínu, tieto praktické a chutné gumy podporujú rast svalov, zlepšujú silu a zvyšujú výkon počas tréningu. Žiadne miešanie, žiadny neporiadok - jednoducho zjedz, žuj a poháňaj svoje fitness ciele. Ideálne pre rušné dni alebo športovcov na cestách!',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/creatine-gummies.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(creatineGummies.id, {
      buffer: this.getFileBuffer(
        __dirname +
          '/../../prisma/seed/data/images/creatine-monohydrate-gummies-1.jpg',
      ),
      mimeType: 'image/jpg',
    });

    const proteinPowder = await this.productsService.create({
      isPublic: true,
      slug: 'whey-protein-powder',
      categoryId: proteinCategory.id,
    });

    await this.productsService.createProductTranslation(proteinPowder.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Whey Protein Powder',
      description:
        'High-quality whey protein powder for muscle building and recovery.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/protein-powder.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(proteinPowder.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Whey Proteínový Prášok',
      description:
        'Vysokokvalitný srvátkový proteínový prášok na budovanie svalov a regeneráciu.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/protein-powder.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(proteinPowder.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/protein-powder-1.png',
      ),
      mimeType: 'image/png',
    });

    await this.productsService.addProductImage(proteinPowder.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/protein-powder-2.png',
      ),
      mimeType: 'image/png',
    });

    const proteinBar = await this.productsService.create({
      isPublic: true,
      slug: 'protein-bar',
      categoryId: proteinCategory.id,
    });

    await this.productsService.createProductTranslation(proteinBar.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Protein Bar',
      description:
        'Delicious protein bar for on-the-go nutrition and muscle support.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/protein-bar.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(proteinBar.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Proteínová Tyčinka',
      description:
        'Chutná proteínová tyčinka pre výživu na cestách a podporu svalov.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/protein-bar.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(proteinBar.id, {
      buffer: this.getFileBuffer(
        __dirname +
          '/../../prisma/seed/data/images/protein-bar-chocolate-1.png',
      ),
      mimeType: 'image/png',
    });

    await this.productsService.addProductImage(proteinBar.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/protein-bar-vanilla-1.png',
      ),
      mimeType: 'image/png',
    });

    const compressionShirt = await this.productsService.create({
      isPublic: true,
      slug: 'compression-shirt',
      categoryId: clothingCategory.id,
    });

    await this.productsService.createProductTranslation(compressionShirt.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Compression Shirt',
      description:
        'High-performance compression shirt for enhanced athletic performance.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/compression-shirt.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(compressionShirt.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Kompresné Tričko',
      description:
        'Vysokovýkonné kompresné tričko pre zlepšenie atletického výkonu.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/compression-shirt.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(compressionShirt.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/compression-shirt-1.png',
      ),
      mimeType: 'image/png',
    });

    await this.productsService.addProductImage(compressionShirt.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/compression-shirt-2.png',
      ),
      mimeType: 'image/png',
    });

    const shorts = await this.productsService.create({
      isPublic: true,
      slug: 'fitness-shorts',
      categoryId: clothingCategory.id,
    });

    await this.productsService.createProductTranslation(shorts.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Fitness Shorts',
      description:
        'Comfortable fitness shorts for optimal workout performance.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/shorts.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(shorts.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Fitness Šortky',
      description:
        'Pohodlné fitness šortky pre optimálny výkon počas tréningu.',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/shorts.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(shorts.id, {
      buffer: this.getFileBuffer(
        __dirname + '/../../prisma/seed/data/images/shorts-1.png',
      ),
      mimeType: 'image/png',
    });

    const weight300g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '300g',
    });

    await this.productVariantsService.create({
      productId: creatineMonohydrate.id,
      sku: 'creatine-monohydrate-300g',
      priceInCents: 1599,
      stock: 100,
      isPublic: true,
      attributes: [weight300g.id],
    });

    const weight1000g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '1000g',
    });
    await this.productVariantsService.create({
      productId: creatineMonohydrate.id,
      sku: 'creatine-monohydrate-1000g',
      priceInCents: 3599,
      stock: 100,
      attributes: [weight1000g.id],
      isPublic: true,
    });

    await this.productVariantsService.create({
      productId: proteinPowder.id,
      sku: 'whey-protein-powder-1000g',
      priceInCents: 2499,
      stock: 100,
      isPublic: true,
      attributes: [weight1000g.id],
    });

    const weight500g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '500g',
    });

    await this.productVariantsService.create({
      productId: creatineGummies.id,
      sku: 'creatine-gummies-500g',
      priceInCents: 1999,
      stock: 100,
      attributes: [weight500g.id],
      isPublic: true,
    });

    const weight2000g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '2000g',
    });

    await this.productVariantsService.create({
      productId: proteinPowder.id,
      sku: 'whey-protein-powder-2000g',
      priceInCents: 4599,
      stock: 100,
      isPublic: true,
      attributes: [weight2000g.id],
    });

    const sizeAttributeKey = await this.attributeKeysService.create({
      key: 'size',
    });

    const colorBlack = await this.attributesService.create({
      keyId: colorKey.id,
      value: 'black',
    });

    await this.attributesService.createTranslation({
      attributeId: colorBlack.id,
      locale: this.localesService.locales().english.code,
      valueTranslation: 'black',
    });

    await this.attributesService.createTranslation({
      attributeId: colorBlack.id,
      locale: this.localesService.locales().slovak.code,
      valueTranslation: 'čierna',
    });

    await this.attributeKeysService.createTranslation({
      keyId: sizeAttributeKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'size',
    });

    await this.attributeKeysService.createTranslation({
      keyId: sizeAttributeKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'veľkosť',
    });

    const sizeS = await this.attributesService.create({
      keyId: sizeAttributeKey.id,
      value: 'S',
    });

    const sizeM = await this.attributesService.create({
      keyId: sizeAttributeKey.id,
      value: 'M',
    });

    const sizeL = await this.attributesService.create({
      keyId: sizeAttributeKey.id,
      value: 'L',
    });

    const sizeXL = await this.attributesService.create({
      keyId: sizeAttributeKey.id,
      value: 'XL',
    });

    await this.productVariantsService.create({
      productId: compressionShirt.id,
      sku: 'compression-shirt-black-s',
      priceInCents: 2199,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeS.id],
    });

    await this.productVariantsService.create({
      productId: compressionShirt.id,
      sku: 'compression-shirt-black-m',
      priceInCents: 2199,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeM.id],
    });

    await this.productVariantsService.create({
      productId: compressionShirt.id,
      sku: 'compression-shirt-black-l',
      priceInCents: 2199,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeL.id],
    });

    await this.productVariantsService.create({
      productId: compressionShirt.id,
      sku: 'compression-shirt-black-xl',
      priceInCents: 2199,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeXL.id],
    });

    await this.productVariantsService.create({
      productId: shorts.id,
      sku: 'fitness-shorts-black-s',
      priceInCents: 1499,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeS.id],
    });

    await this.productVariantsService.create({
      productId: shorts.id,
      sku: 'fitness-shorts-black-m',
      priceInCents: 1499,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeM.id],
    });

    await this.productVariantsService.create({
      productId: shorts.id,
      sku: 'fitness-shorts-black-l',
      priceInCents: 1499,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeL.id],
    });

    await this.productVariantsService.create({
      productId: shorts.id,
      sku: 'fitness-shorts-black-xl',
      priceInCents: 1499,
      stock: 50,
      isPublic: true,
      attributes: [colorBlack.id, sizeXL.id],
    });

    const weight60g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '60g',
    });

    const flavorAttributeKey = await this.attributeKeysService.create({
      key: 'flavor',
    });

    await this.attributeKeysService.createTranslation({
      keyId: flavorAttributeKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'flavor',
    });

    await this.attributeKeysService.createTranslation({
      keyId: flavorAttributeKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'príchuť',
    });

    const chocolateFlavor = await this.attributesService.create({
      keyId: flavorAttributeKey.id,
      value: 'chocolate',
    });

    await this.attributesService.createTranslation({
      attributeId: chocolateFlavor.id,
      locale: this.localesService.locales().english.code,
      valueTranslation: 'chocolate',
    });

    await this.attributesService.createTranslation({
      attributeId: chocolateFlavor.id,
      locale: this.localesService.locales().slovak.code,
      valueTranslation: 'čokoláda',
    });

    const vanillaFlavor = await this.attributesService.create({
      keyId: flavorAttributeKey.id,
      value: 'vanilla',
    });

    await this.attributesService.createTranslation({
      attributeId: vanillaFlavor.id,
      locale: this.localesService.locales().english.code,
      valueTranslation: 'vanilla',
    });

    await this.attributesService.createTranslation({
      attributeId: vanillaFlavor.id,
      locale: this.localesService.locales().slovak.code,
      valueTranslation: 'vanilka',
    });

    await this.productVariantsService.create({
      productId: proteinBar.id,
      sku: 'protein-bar-chocolate-60g',
      priceInCents: 299,
      stock: 200,
      isPublic: true,
      attributes: [weight60g.id, chocolateFlavor.id],
    });

    await this.productVariantsService.create({
      productId: proteinBar.id,
      sku: 'protein-bar-vanilla-60g',
      priceInCents: 299,
      stock: 200,
      isPublic: true,
      attributes: [weight60g.id, vanillaFlavor.id],
    });

    this.logger.log('Products seeded.');

    if (!skipLLMTasks) {
      this.logger.log('Embed product data into Qdrant vector database...');
      for (const product of [
        creatineMonohydrate,
        creatineGummies,
        proteinPowder,
        proteinBar,
        compressionShirt,
        shorts,
      ]) {
        for (const locale of this.localesService.findAll()) {
          await this.productsService.generateProductEmbeddings(
            product.id,
            locale.code,
          );
        }
      }

      while (
        (await this.llmTasksQueue.getJobCountByTypes(
          'waiting',
          'active',
          'wait',
          'delayed',
        )) > 0
      ) {
        this.logger.log('Waiting for LLM tasks to complete...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      this.logger.log('Product data embedded into Qdrant vector database.');
    }

    this.logger.log('Seeding orders...');
    // seed orders
    const allItems = await this.prismaService.productVariant.findMany();
    const users = await this.prismaService.user.findMany();
    for (const user of users) {
      const numberOfOrders = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < numberOfOrders; i++) {
        const items = fakerSK.helpers
          .arrayElements(allItems, {
            min: 1,
            max: allItems.length,
          })
          .map((item) => {
            const quantity = fakerSK.number.int({ min: 1, max: 3 });
            return {
              ...item,
              quantity,
            };
          });
        const createdOrder = await this.prismaService.order.create({
          include: {
            orderItems: {
              include: {
                ProductVariant: {
                  select: {
                    productId: true,
                    id: true,
                  },
                },
              },
            },
          },
          data: {
            userId: user.id,
            totalInCents: items.reduce(
              (sum, item) => sum + item.priceInCents * item.quantity,
              0,
            ),
            orderItems: {
              createMany: {
                data: items.map((item) => ({
                  productVariantId: item.id,
                  quantity: item.quantity,
                  sku: item.sku,
                  unitPriceInCents: item.priceInCents,
                })),
              },
            },
            status: 'DELIVERED',
            shippingDetails: {
              create: {
                country: fakerSK.location.country(),
                city: fakerSK.location.city(),
                postalCode: fakerSK.location.zipCode(),
                line1: fakerSK.location.streetAddress(),
                line2: fakerSK.location.secondaryAddress(),
                name: `${user.firstName} ${user.lastName}`,
                phone: fakerSK.phone.number(),
                state: fakerSK.location.state(),
              },
            },
          },
        });

        this.logger.log(`Created order ${createdOrder.id}. Adding reviews...`);
        for (const item of createdOrder.orderItems) {
          await this.prismaService.productReview.create({
            data: {
              productId: item.ProductVariant!.productId,
              userId: createdOrder.userId,
              rating: fakerSK.number.int({ min: 1, max: 5 }),
              comment: fakerSK.lorem.sentence({ min: 1, max: 5 }),
              lang: this.localesService.locales().slovak.code,
              productVariantId: item.productVariantId,
              orderItemId: item.id,
            },
          });
        }
      }
      this.logger.log('Seeding completed.');
    }
  }

  private getFileBuffer(file: string) {
    return fs.readFileSync(file);
  }
}
