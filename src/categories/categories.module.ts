import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Category } from "./models/category.model";
import { JwtModule } from "@nestjs/jwt";
import { Product } from "../product/model/product.model";

@Module({
  imports: [SequelizeModule.forFeature([Category, Product]), JwtModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
