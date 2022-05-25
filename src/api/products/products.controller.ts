import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import {
  AuthUser,
  AuthUserGuard,
  IJwt,
  IQuery,
  Language,
  LanguageType,
  MediaMulterOptions,
  QueryPipe,
} from '../../core';
import { IProduct } from './models';

@Controller('products')
@UseGuards(AuthUserGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @UsePipes(QueryPipe)
  public getProducts(
    @Query() query: IQuery,
    @Language() language: LanguageType,
    @AuthUser() jwt: IJwt,
  ): Promise<IProduct[]> {
    return this.service.getProducts(query, language, jwt.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('media', MediaMulterOptions))
  public async createProduct(
    @Body() { body },
    @UploadedFile() image: any,
    @Language() language: LanguageType,
    @AuthUser() jwt: IJwt,
  ): Promise<void> {
    return await this.service.createProduct(JSON.parse(body), image, jwt);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('media', MediaMulterOptions))
  public async editProduct(
    @Body() { body },
    @UploadedFile() image: any,
    @Param('id') id: number,
    @Language() language: LanguageType,
    @AuthUser() jwt: IJwt,
  ): Promise<void> {
    return await this.service.editProduct(JSON.parse(body), id, image, jwt);
  }

  @Delete(':id')
  public deleteProduct(
    @Param('id') productId: number,
    @AuthUser() jwt: IJwt,
  ): Promise<void> {
    return this.service.deleteProduct(productId, jwt);
  }
}
