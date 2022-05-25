import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { HistoryModule } from './history';
import { ProductsModule } from './products';
import { ProfileModule } from './profile';
import { I18nModule } from './i18n';

@Module({
  imports: [
    AuthModule,
    HistoryModule,
    ProductsModule,
    ProfileModule,
    I18nModule,
  ],
})
export class ApiModule {}
