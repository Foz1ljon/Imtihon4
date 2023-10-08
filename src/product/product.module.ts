import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./model/product.model";
import { FilesModule } from "../files/files.module";
import { Category } from "../categories/models/category.model";
import { Customer } from "../customers/model/customer.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [SequelizeModule.forFeature([Product, Category, Customer]), FilesModule, JwtModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
