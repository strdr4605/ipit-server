import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HistoryEntity } from './history.entity';
import { ProductNameEntity } from './product-name.entity';
import { UserEntity } from './user.entity';
import { ProductStatusType } from '../core/models';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: string;

  @OneToOne(() => ProductNameEntity, (translate) => translate.product, {
    cascade: true,
  })
  @JoinColumn()
  public name: ProductNameEntity;

  @Column({ type: 'float' })
  public carbs: number;

  @Column({ type: 'float' })
  public fats: number;

  @Column({ type: 'float' })
  public protein: number;

  @Column()
  public status: ProductStatusType;

  @Column({ nullable: true })
  public image: string;

  @OneToMany(() => HistoryEntity, (history) => history.product)
  public history: HistoryEntity[];

  @ManyToOne(() => UserEntity, (user) => user.products)
  public author: UserEntity;
}
