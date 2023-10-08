import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

interface CreateAdminAttr {
  username: string;
  email: string;
  password: string;
}

@Table({ tableName: "admin" })
export class Admin extends Model<Admin, CreateAdminAttr> {
  @ApiProperty({ example: "1", description: "Admin ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "admin1", description: "Admin Username" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;

  @ApiProperty({ example: "admin1", description: "Admin email" })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @ApiProperty({ example: "QWer!343", description: "Admin password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: "true", description: "Admin active" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  active: boolean;

  @ApiProperty({ example: "true", description: "Admin Owner" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_owner: boolean;

  @ApiProperty({ example: "#&CH*CHV*#", description: "Admin refresh token" })
  @Column({ type: DataType.STRING })
  hashed_refresh_token: string;

  @ApiProperty({ example: "#&CH*CHV*#", description: "Admin activation link" })
  @Column({ type: DataType.STRING })
  activation_link: string;


}
