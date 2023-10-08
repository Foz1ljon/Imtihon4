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

interface CreateBasketAttr {
  customer_id: number;
  product_id: number;
}
@Table({ tableName: "baskets" })
export class Basket extends Model<Basket, CreateBasketAttr> {
  @ApiProperty({ example: "1", description: "Unique ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "1", description: "Customer ID" })
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customer_id: number;

  @ApiProperty({ example: "1", description: "Product ID" })
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Customer)
  customers: Customer;

  @BelongsTo(() => Product)
  products: Product;
}
