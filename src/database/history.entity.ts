import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity()
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: string;

  @Column({ type: 'float' })
  public quantity: number;

  @ManyToOne(() => UserEntity, (user) => user.history)
  public author: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.history)
  public product: ProductEntity;
}
