import { Injectable } from '@nestjs/common';
import { Locales } from '.';

@Injectable()
export class LocalesService {
  constructor() {}

  findAll() {
    return Array.from(Object.values(Locales));
  }

  findOne(code: string) {
    return code in Locales ? Locales[code as keyof typeof Locales] : undefined;
  }

  locales() {
    return Locales;
  }
}
