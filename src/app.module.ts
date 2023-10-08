import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
import { CustomersModule } from "./customers/customers.module";
import { Customer } from "./customers/model/customer.model";
import { FilesModule } from "./files/files.module";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/model/admin.model";
import { CategoriesModule } from "./categories/categories.module";
import { Category } from "./categories/models/category.model";
import { ProductModule } from "./product/product.module";
import { Product } from "./product/model/product.model";
import { BasketModule } from "./basket/basket.module";
import { PurchaseModule } from "./purchase/purchase.module";
import { Basket } from "./basket/models/basket.model";
import { Purchase } from "./purchase/models/purchase.model";
import { HistoryModule } from "./history/history.module";
import { History } from "./history/models/history.model";

const { env } = process;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({ rootPath: resolve(__dirname, "static") }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: env.db_host,
      port: Number(env.db_port),
      username: env.db_user,
      password: String(env.db_password),
      database: env.db_dbname,
      /* Models */
      models: [Customer, Admin, Category, Product, Basket, Purchase, History],
      /* Models */
      autoLoadModels: true,
      logging: false,
    }),
    /* Modules */
    CustomersModule,
    FilesModule,
    AdminModule,
    CategoriesModule,
    ProductModule,
    BasketModule,
    PurchaseModule,
    HistoryModule,
  ],
})
export class AppModule {}
