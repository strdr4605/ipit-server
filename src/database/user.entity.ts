import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { HistoryEntity } from './history.entity';
import { ProductEntity } from './product.entity';
import { ActivityType, GenderType, GoalType } from '../core/models';

class PasswordTransformer implements ValueTransformer {
  public to(value: string): string {
    if (value) {
      return bcrypt.hashSync(value, 10);
    }
    return value;
  }

  public from(value: string): string {
    return value;
  }
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: string;

  @Column({ nullable: true })
  public lastActivity: Date;

  @Column({ unique: true, nullable: true })
  public email: string;

  @Column({
    select: false,
    nullable: true,
    transformer: new PasswordTransformer(),
  })
  public password: string;

  @Column({ select: false, nullable: true })
  public twoFactorCode: string;

  @Column('timestamp', { select: false, nullable: true })
  public twoFactorResetDate: string;

  @Column()
  public role: string;

  @Column({ nullable: true })
  public avatar: number;

  @Column()
  public age: number;

  @Column()
  public height: number;

  @Column()
  public weight: number;

  @Column()
  public goal: GoalType;

  @Column()
  public gender: GenderType;

  @Column()
  public activity: ActivityType;

  @OneToMany(() => HistoryEntity, (history) => history.author)
  public history: HistoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.author)
  public products: ProductEntity[];
}
