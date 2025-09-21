import { Injectable, Scope } from '@nestjs/common';
import { CategoriesService } from '../categories.service';

@Injectable({ scope: Scope.REQUEST })
export class CategoriesDataLoader {
  constructor(private categoriesService: CategoriesService) {}

  createLoader() {}
}
