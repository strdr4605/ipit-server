import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { ApiModule } from './api';

@Module({
  imports: [CoreModule, ApiModule],
})
export class AppModule {}
