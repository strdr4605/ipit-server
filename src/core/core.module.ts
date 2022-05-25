import { Module } from '@nestjs/common';

import { Tracker } from './tracker';

@Module({})
export class CoreModule {
  constructor() {
    new Tracker();
  }
}
