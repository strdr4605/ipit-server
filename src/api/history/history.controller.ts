import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { HistoryService } from './history.service';
import {
  AuthUser,
  AuthUserGuard,
  IJwt,
  IQuery,
  Language,
  LanguageType,
  QueryPipe,
} from '../../core';
import { IHistory, IHistoryCreate, IHistoryUpdate } from './models';

@Controller('history')
@UseGuards(AuthUserGuard)
export class HistoryController {
  constructor(private readonly _service: HistoryService) {}

  @Get()
  @UsePipes(QueryPipe)
  public getMany(
    @Query() query: IQuery,
    @AuthUser() jwt: IJwt,
    @Language() language: LanguageType,
  ): Promise<IHistory[]> {
    return this._service.getMany(query, jwt.id, language);
  }

  @Post()
  public create(
    @Body() history: IHistoryCreate,
    @AuthUser() jwt: IJwt,
  ): Promise<number> {
    return this._service.create(history, jwt.id);
  }

  @Put(':id')
  public update(
    @Body() history: IHistoryUpdate,
    @Param('id') historyId: number,
    @AuthUser() jwt: IJwt,
  ): Promise<number> {
    return this._service.update(history, historyId, jwt.id);
  }

  @Delete(':id')
  public delete(
    @Param('id') historyId: number,
    @AuthUser() jwt: IJwt,
  ): Promise<void> {
    return this._service.delete(historyId, jwt.id);
  }
}
