import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { getManager } from 'typeorm';

import { ILogin, IRegister } from './models';
import { ErrorType, RoleType } from '../../core';
import { UserEntity } from '../../database';

@Injectable()
export class AuthService {
  constructor(private readonly _jwt: JwtService) {}

  public async createToken(userId: number): Promise<string> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager.findOne(UserEntity, { id: userId });
      if (!user) throw new UnauthorizedException();

      return this._jwt.sign({ id: user.id, role: user.role });
    });
  }

  public async login(request: ILogin): Promise<UserEntity> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager
        .createQueryBuilder(UserEntity, 'user')
        .addSelect('user.password')
        .where('user.email = :email', { email: request.email })
        .getOne();

      if (!user) throw new BadRequestException(ErrorType.AuthInvalidEmail);

      if (!bcrypt.compareSync(request.password, user.password))
        throw new BadRequestException(ErrorType.WrongPassword);

      if (user.role === RoleType.BLOCKED)
        throw new ForbiddenException(ErrorType.AuthBlocked);

      if (user.role === RoleType.DELETED)
        throw new ForbiddenException(ErrorType.AuthDeleted);

      return user;
    });
  }

  public async register(request: IRegister): Promise<UserEntity> {
    return getManager().transaction(async (entityManager) => {
      const user = new UserEntity();
      user.height = request.height;
      user.weight = request.weight;
      user.gender = request.gender;
      user.goal = request.goal;
      user.activity = request.activity;
      user.age = request.age;
      user.role = RoleType.USER;
      user.avatar = 1;
      return await entityManager.save(UserEntity, user);
    });
  }
}
