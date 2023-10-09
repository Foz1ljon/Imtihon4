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
import { Purchase } from "../../purchase/models/purchase.model";

interface CreateHistoryAttr {
  customer_id: number;
  purchase_id: number;
  pay_type: string;
}

@Table({ tableName: "histories" })
export class History extends Model<History, CreateHistoryAttr> {
  @ApiProperty({ example: "1", description: "unique ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "1", description: "Customer ID" })
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER, allowNull: false })
  customer_id: number;

  @ApiProperty({ example: "1", description: "Purchase ID" })
  @ForeignKey(() => Purchase)
  @Column({ type: DataType.INTEGER, allowNull: false })
  purchase_id: number;

  @ApiProperty({ example: "card", description: "Payment type" })
  @Column({ type: DataType.ENUM("card", "cash"), allowNull: false })
  pay_type: "card" | "cash";

  @BelongsTo(() => Customer)
  customer: Customer;

  @BelongsTo(() => Purchase)
  purchase: Purchase;
}
