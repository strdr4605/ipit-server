import { Body, Controller, Post } from '@nestjs/common';
import { IAuthResponse, ILogin, IRegister } from './models';
import { AuthService } from './auth.service';
import { IStrategy, Strategy } from '../../core';

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('login')
  public async login(@Body() request: ILogin): Promise<IAuthResponse> {
    const user = await this._service.login(request);
    return { token: await this._service.createToken(user.id) };
  }

  @Post('register')
  public async register(@Body() request: IRegister): Promise<IAuthResponse> {
    const user = await this._service.register(request);
    return { token: await this._service.createToken(user.id) };
  }

  @Post('strategy')
  public getStrategy(@Body() request: IRegister): IStrategy {
    return Strategy.getStrategy(
      request.height,
      request.weight,
      request.age,
      request.activity,
      request.goal,
      request.gender,
    );
  }
}
