import { Module } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { HistoryController } from "./history.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Customer } from "../customers/model/customer.model";
import { Purchase } from "../purchase/models/purchase.model";
import { JwtModule } from "@nestjs/jwt";
import { History } from "./models/history.model";

@Module({
  imports: [
    SequelizeModule.forFeature([History, Customer, Purchase]),
    JwtModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
