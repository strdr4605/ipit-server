import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ProfileService } from './profile.service';
import { AuthUser, AuthUserGuard, IJwt } from '../../core';
import { IChangePassword, IProfile, IProfileActivate } from './models';

@UseGuards(AuthUserGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly _service: ProfileService) {}

  @Get()
  public async getProfile(@AuthUser() jwt: IJwt): Promise<IProfile> {
    return await this._service.getProfile(jwt.id);
  }

  @Put()
  public async updateProfile(
    @Body() request: IProfile,
    @AuthUser() jwt: IJwt,
  ): Promise<IProfile> {
    return await this._service.updateProfile(request, jwt.id);
  }

  @Post('activate')
  public async activateProfile(
    @Body() request: IProfileActivate,
    @AuthUser() jwt: IJwt,
  ): Promise<IProfile> {
    return await this._service.activateProfile(request, jwt.id);
  }

  @Post('password')
  public async updatePassword(
    @Body() request: IChangePassword,
    @AuthUser() jwt: IJwt,
  ): Promise<void> {
    return await this._service.updatePassword(request, jwt.id);
  }

  @Delete()
  public async deleteProfile(@AuthUser() jwt: IJwt): Promise<void> {
    return await this._service.deleteProfile(jwt.id);
  }
}
