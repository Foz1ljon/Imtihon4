import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Customer } from "./model/customer.model";
import { JwtModule } from "@nestjs/jwt";

import { MailModule } from "../mail/mail.module";
import { FilesModule } from "../files/files.module";
import { Category } from "../categories/models/category.model";
import { CategoriesService } from "../categories/categories.service";
import { CategoriesModule } from "../categories/categories.module";
import { Product } from "../product/model/product.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Customer]),
    JwtModule.register({}),
    MailModule,
    FilesModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
