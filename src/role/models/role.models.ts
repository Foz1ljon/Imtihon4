import { ApiProperty } from "@nestjs/swagger";

import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { AdminRole } from "./admin-roles.model";
import { Admin } from "../../admin/model/admin.model";

interface RoleAttr {
  value: string;
  description: string;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleAttr> {
  @ApiProperty({ example: 1, description: "Unikal ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: "USER", description: "unique role name" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  value: string;

  @ApiProperty({ example: "this is Admin role", description: "about Role" })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({ example: ["USER"], description: "Userlar" })
  @BelongsToMany(() => Admin, () => AdminRole)
  users: Admin[];
}
