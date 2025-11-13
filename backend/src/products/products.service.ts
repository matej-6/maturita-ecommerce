import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  create(input: CreateProductInput) {
    this.logger.log(`creating prdouct with input: ${JSON.stringify(input)}`);

    try {
      return this.prisma.product.create({
        data: {
          slug: input.slug,
          categoryId: input.categoryId,
          isPublic: input.isPublic,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        // https://www.prisma.io/docs/orm/reference/error-reference#p2002
        if (e.code === 'P2002') {
          throw new BadRequestException('products.service.slugAlreadyInUse');
        }
      }
      throw e;
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
