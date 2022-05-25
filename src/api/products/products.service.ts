import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';

import { IProduct } from './models';
import { ProductEntity, ProductNameEntity, UserEntity } from '../../database';
import {
  ErrorType,
  IJwt,
  IQuery,
  LanguageKeys,
  LanguageType,
  ProductStatusType,
  QueryHelper,
} from '../../core';
import { ProductsStorage } from './products.storage';

@Injectable()
export class ProductsService {
  constructor(private readonly _storage: ProductsStorage) {}

  public async getProducts(
    query: IQuery,
    language: LanguageType,
    userId: number,
  ): Promise<IProduct[]> {
    return getManager().transaction(async (entityManager) => {
      const qb = entityManager
        .createQueryBuilder(ProductEntity, 'product')
        .leftJoin('product.name', 'name')
        .select('product.id', 'id')
        .addSelect('product.carbs', 'carbs')
        .addSelect('product.fats', 'fats')
        .addSelect('product.protein', 'protein')
        .addSelect('product.image', 'image')
        .addSelect(`name.${LanguageKeys.get(language)}`, 'name')
        .orderBy('product.createdAt', 'DESC');
      QueryHelper.isAuthorOrPublic('product', qb, userId);
      QueryHelper.addQuery('product', qb, query, language);
      return qb.getRawMany();
    });
  }

  public async createProduct(
    request: IProduct,
    uploadedImage: any,
    user: IJwt,
  ): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      const product = new ProductEntity();
      product.author = <UserEntity>{ id: user.id };
      product.status = ProductStatusType.Private;
      product.name = new ProductNameEntity();

      product.name.ro = request.name;
      product.name.en = request.name;
      product.name.ru = request.name;
      product.carbs = Number(request.carbs);
      product.fats = Number(request.fats);
      product.protein = Number(request.protein);

      const savedProduct = await entityManager.save(ProductEntity, product);

      if (uploadedImage) {
        savedProduct.image = await this._storage
          .uploadImage(uploadedImage, savedProduct.id)
          .catch((e) => {
            throw new BadRequestException(e);
          });

        await entityManager.save(ProductEntity, savedProduct);
      }
    });
  }

  public async editProduct(
    request: IProduct,
    productId: number,
    uploadedImage: any,
    user: IJwt,
  ): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      let product = await ProductsService.getProductIfCan(
        entityManager,
        productId,
        user.id,
      );
      if (!product)
        throw new BadRequestException(ErrorType.PublicProductEditNoRights);

      product.name.ro = request.name;
      product.name.en = request.name;
      product.name.ru = request.name;
      product.carbs = Number(request.carbs);
      product.fats = Number(request.fats);
      product.protein = Number(request.protein);

      const uploadImage = async () => {
        product.image = await this._storage
          .uploadImage(uploadedImage, product.id)
          .catch((e) => {
            throw new BadRequestException(e);
          });
      };

      const removeImage = async () => {
        await this._storage.removeImage(product.image);
        product.image = null;
      };

      if (product.image && uploadedImage) {
        await removeImage();
        await uploadImage();
      } else if (!product.image && uploadedImage) {
        await uploadImage();
      } else if (!request.image && product.image && !uploadedImage) {
        await removeImage();
      }

      await entityManager.save(product);
    });
  }

  public async deleteProduct(productId: number, user: IJwt): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      const product = await ProductsService.getProductIfCan(
        entityManager,
        productId,
        user.id,
      );
      if (!product)
        throw new BadRequestException(ErrorType.PublicProductDeleteNoRights);

      await this._storage.removeImage(product.image);
      product.status = ProductStatusType.Archived;
      product.image = null;

      await entityManager.save(ProductEntity, product);
    });
  }

  private static async getProductIfCan(
    entityManager: EntityManager,
    productId: number,
    userId: number,
  ): Promise<ProductEntity> {
    return await entityManager
      .createQueryBuilder(ProductEntity, 'product')
      .leftJoinAndSelect('product.author', 'author')
      .andWhere(`product.id = ${productId}`)
      .andWhere(`author.id = ${userId}`)
      .andWhere(`product.status = :privateStatus`, {
        privateStatus: ProductStatusType.Private,
      })
      .getOne();
  }
}
