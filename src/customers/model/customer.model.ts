import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Basket } from "../../basket/models/basket.model";
import { Product } from "../../product/model/product.model";

interface CreateCustomerAttr {
  firstname: string;
  lastname: string;
  photo: string;
  birthdate: Date;
  passport: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: "customers" })
export class Customer extends Model<Customer, CreateCustomerAttr> {
  @ApiProperty({ example: "1", description: "Unique ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "Shokirjon", description: "Customer Name" })
  @Column({ type: DataType.STRING, allowNull: false })
  firstname: string;

  @ApiProperty({ example: "Qodirov", description: "Customer Surname" })
  @Column({ type: DataType.STRING, allowNull: false })
  lastname: string;

  @ApiProperty({ example: "default.jpg", description: "Customer photo" })
  @Column({ type: DataType.STRING })
  photo: string;

  @ApiProperty({ example: "AA 1234567", description: "Customer passport" })
  @Column({ type: DataType.STRING, allowNull: false })
  passport: string;

  @ApiProperty({ example: "1998-06-06", description: "Customer BirthDate" })
  @Column({ type: DataType.DATE, allowNull: false })
  birthdate: Date;

  @ApiProperty({
    example: "Toshkent, Navoiy street, 14-a",
    description: "Customer Address",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @ApiProperty({
    example: "Shokirjon777@example.com",
    description: "Customer email",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty({ example: "+998911234567", description: "Customer phone" })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @ApiProperty({ example: "shoKir77&:!", description: "Customer password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: "#&CH*CHV*#", description: "Customer activate link" })
  @Column({ type: DataType.UUID })
  activation_link: string;

  @ApiProperty({ example: "true", description: "Customer active" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_active: boolean;

  @ApiProperty({ example: "#&CH*CHV*#", description: "Customer refresh token" })
  @Column({ type: DataType.STRING })
  hashed_refresh_token: string;

  @BelongsToMany(() => Product, () => Basket)
  baskets: Product[];
}
