import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Customer } from "../../customers/model/customer.model";
import { Product } from "../../product/model/product.model";
import { Admin } from "../../admin/model/admin.model";

interface CreatePurchaseAttr {
  customer_id: number;
  admin_id: number;
  product_id: number;
  total_amount: number;
  interest_rate: number;
  installmentDuration: number;
  paymentDate: number;
  paymentMonth: number;
}
@Table({ tableName: "purchases", timestamps: false })
export class Purchase extends Model<Purchase, CreatePurchaseAttr> {
  @ApiProperty({ example: "1", description: "unique ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "1", description: "customer ID" })
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customer_id: number;

  @ApiProperty({ example: "1", description: "admin ID" })
  @ForeignKey(() => Admin)
  @Column({ type: DataType.INTEGER })
  admin_id: number;

  @ApiProperty({ example: "1", description: "product ID" })
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id: number;

  @ApiProperty({ example: "2003-03-03", description: "pruchaseDate" })
  @Column({ type: DataType.DATE, defaultValue: new Date() })
  purchase_date: Date;

  @ApiProperty({ example: "40000", description: "All Sum" })
  @Column({ type: DataType.INTEGER })
  total_amount: number;

  @ApiProperty({ example: "5%", description: "Percent Number" })
  @Column({ type: DataType.FLOAT })
  interest_rate: number;

  @ApiProperty({ example: "11", description: "Date " })
  @Column({ type: DataType.SMALLINT })
  installmentDuration: number;

  @ApiProperty({ example: "06", description: "Payment Date Number" })
  @Column({ type: DataType.SMALLINT, allowNull: false })
  paymentDay: Date;

  @ApiProperty({ example: "50000", description: "Payment in month" })
  @Column({ type: DataType.FLOAT, allowNull: false })
  paymentMonth: number;

  @ApiProperty({ example: "true", description: "Status" })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  status: boolean;

  @BelongsTo(() => Customer)
  customer: Customer;

  @BelongsTo(() => Admin)
  admin: Admin;

  @BelongsTo(() => Product)
  product: Product;
}
