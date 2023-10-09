import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Basket } from "./models/basket.model";
import { Customer } from "../customers/model/customer.model";
import { JwtModule } from "@nestjs/jwt";
import { Product } from "../product/model/product.model";

@Module({
  imports: [SequelizeModule.forFeature([Basket, Customer, Product]),JwtModule],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
