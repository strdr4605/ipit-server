import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { ProductEntity } from "./product.entity";

@Entity()
export class ProductNameEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public en: string;

  @Column({ nullable: true })
  public ro: string;

  @Column({ nullable: true })
  public ru: string;

  @OneToOne(() => ProductEntity)
  public product: ProductEntity;
}
