import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { PaginatedProduct, Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationArgs } from 'src/lib/pagination.args';
import { ProductFindAllQueryArgs } from './products.resolver.args';
import { UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import {
  OptionalCurrentUser,
  OptionalCurrentUserDto,
} from 'src/auth/optional-current-user.decorator';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productsService.create(createProductInput);
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => PaginatedProduct, { name: 'products' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() findAllQueryArgs: ProductFindAllQueryArgs,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    return this.productsService.findAll(
      findAllQueryArgs,
      paginationArgs,
      user?.role,
    );
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.remove(id);
  }
}
