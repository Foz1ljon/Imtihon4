import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Admin } from "./model/admin.model";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail/mail.module";
import { Role } from "../role/models/role.models";
import { AdminRole } from "../role/models/admin-roles.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Admin, Role, AdminRole]),
    JwtModule,
    MailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
