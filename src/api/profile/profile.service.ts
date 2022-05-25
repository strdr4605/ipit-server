import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { getManager } from 'typeorm';

import { ErrorType, RoleType, Strategy } from '../../core';
import { IChangePassword, IProfile, IProfileActivate } from './models';
import { UserEntity } from '../../database';

@Injectable()
export class ProfileService {
  public async getProfile(userId: number): Promise<IProfile> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager.findOne(UserEntity, { id: userId });
      if (!user) throw new UnauthorizedException();

      return {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        age: user.age,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activity: user.activity,
        gender: user.gender,
        strategy: Strategy.getStrategy(
          user.height,
          user.weight,
          user.age,
          user.activity,
          user.goal,
          user.gender,
        ),
      };
    });
  }

  public async updateProfile(
    request: IProfile,
    userId: number,
  ): Promise<IProfile> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager.findOne(UserEntity, { id: userId });
      if (!user) throw new UnauthorizedException();

      if (request.avatar) user.avatar = request.avatar;
      if (request.age) user.age = request.age;
      if (request.height) user.height = request.height;
      if (request.weight) user.weight = request.weight;
      if (request.gender) user.gender = request.gender;
      if (request.goal) user.goal = request.goal;
      if (request.activity) user.activity = request.activity;
      const updated = await entityManager.save(UserEntity, user);

      return {
        id: updated.id,
        email: updated.email,
        avatar: updated.avatar,
        age: updated.age,
        height: updated.height,
        weight: updated.weight,
        goal: updated.goal,
        activity: updated.activity,
        gender: updated.gender,
        strategy: Strategy.getStrategy(
          updated.height,
          updated.weight,
          updated.age,
          updated.activity,
          updated.goal,
          updated.gender,
        ),
      };
    });
  }

  public async activateProfile(
    request: IProfileActivate,
    userId: number,
  ): Promise<IProfile> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager.findOne(UserEntity, { id: userId });
      if (!user) throw new UnauthorizedException();

      if (user.email) throw new BadRequestException(ErrorType.AuthActivated);
      const exist = await entityManager.findOne(UserEntity, {
        email: request.email,
      });
      if (exist) throw new BadRequestException(ErrorType.AuthUserExists);

      user.email = request.email;
      user.password = request.password;

      const updated = await entityManager.save(UserEntity, user);
      return {
        id: updated.id,
        email: updated.email,
        avatar: updated.avatar,
        age: updated.age,
        height: updated.height,
        weight: updated.weight,
        goal: updated.goal,
        activity: updated.activity,
        gender: updated.gender,
        strategy: Strategy.getStrategy(
          updated.height,
          updated.weight,
          updated.age,
          updated.activity,
          updated.goal,
          updated.gender,
        ),
      };
    });
  }

  public async updatePassword(
    request: IChangePassword,
    userId: number,
  ): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager
        .createQueryBuilder(UserEntity, 'user')
        .addSelect('user.password')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (!user) throw new NotFoundException(ErrorType.ProfileNotFound);

      if (!bcrypt.compareSync(request.currentPassword, user.password))
        throw new BadRequestException(ErrorType.WrongPassword);

      user.password = request.newPassword;

      await entityManager.save(UserEntity, user);
    });
  }

  public async deleteProfile(userId: number): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      const user = await entityManager.findOne(UserEntity, { id: userId });
      if (!user) throw new NotFoundException(ErrorType.ProfileNotFound);

      user.role = RoleType.DELETED;

      await entityManager.save(UserEntity, user);
    });
  }
}
