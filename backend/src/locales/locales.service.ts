import { Injectable } from '@nestjs/common';
import { CreateLocaleInput } from './dto/create-locale.input';
import { UpdateLocaleInput } from './dto/update-locale.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocalesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createLocaleInput: CreateLocaleInput) {
    return this.prisma.locale.create({
      data: createLocaleInput,
    });
  }

  findAll(page: number = 1, take = 10) {
    if (take < 10) take = 10;
    if (take > 100) take = 100;
    if (page < 1) page = 1;
    return this.prisma.locale.findMany({
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  findOne(id: string) {
    return this.prisma.locale.findUnique({
      where: { id },
    });
  }

  findByLocaleCode(localeCode: string) {
    return this.prisma.locale.findUnique({
      where: { code: localeCode },
    });
  }

  update(id: string, updateLocaleInput: UpdateLocaleInput) {
    return this.prisma.locale.update({
      where: {
        id,
      },
      data: updateLocaleInput,
    });
  }

  remove(id: string) {
    return this.prisma.locale.delete({
      where: { id },
    });
  }
}
