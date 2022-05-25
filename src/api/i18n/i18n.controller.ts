import { Controller, Get } from '@nestjs/common';
import { Language, LanguageType } from '../../core';

@Controller('i18n')
export class I18nController {
  private readonly _languages: Map<LanguageType, any> = new Map([
    [LanguageType.English, import('./json/en.json')] as any,
    [LanguageType.Russian, import('./json/ru.json')] as any,
    [LanguageType.Romanian, import('./json/ro.json')] as any,
  ]);

  @Get()
  public async get(@Language() language: LanguageType): Promise<any> {
    return this._languages.get(language);
  }
}
