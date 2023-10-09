import { ApiProperty } from "@nestjs/swagger";

import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Role } from "./role.models";
import { Admin } from "../../admin/model/admin.model";

@Table({ tableName: "user_roles", createdAt: false, updatedAt: false })
export class AdminRole extends Model<AdminRole> {
  @ApiProperty({ example: "3", description: " unikal ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "2", description: "mavjud bolgan ID si" })
  @ForeignKey(() => Admin)
  @Column({ type: DataType.INTEGER })
  admin_id: number;

  @ApiProperty({ example: "2", description: "mavjud bolgan rol ID si" })
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id: number;
}
