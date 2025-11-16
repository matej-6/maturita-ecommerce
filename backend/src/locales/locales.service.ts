import { Injectable } from '@nestjs/common';
import { Locales } from '.';

@Injectable()
export class LocalesService {
  constructor() {}

  findAll() {
    return Array.from(Object.values(Locales));
  }

  findOne(code: string) {
    return this.findAll().find(
      (l) => l.code.toLowerCase() === code.toLowerCase(),
    );
  }

  getDefaultLocale() {
    return Locales.english;
  }

  locales() {
    return Locales;
  }
}
