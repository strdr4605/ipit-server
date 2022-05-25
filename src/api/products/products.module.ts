import { Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsStorage } from './products.storage';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsStorage],
})
export class ProductsModule {}
