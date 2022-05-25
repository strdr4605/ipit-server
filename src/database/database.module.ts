import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductNameEntity } from './product-name.entity';
import { HistoryEntity } from './history.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres' as any,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, ProductEntity, ProductNameEntity, HistoryEntity],
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      logging: process.env.DATABASE_LOGGING === 'true',
    }),
  ],
})
export class DatabaseModule {}
