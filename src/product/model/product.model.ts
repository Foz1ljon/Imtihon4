import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Category } from "../../categories/models/category.model";
import { Basket } from "../../basket/models/basket.model";
import { Customer } from "../../customers/model/customer.model";

interface CreateProductAtts {
  photo: string;
  title: string;
  description: string;
  count: number;
  price: number;
  category_id: number;
}
@Table({ tableName: "products" })
export class Product extends Model<Product, CreateProductAtts> {
  @ApiProperty({ example: "1", description: "Unique ID" })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: "image.jpg", description: "Product photo" })
  @Column({ type: DataType.STRING })
  photo: string;

  @ApiProperty({ example: "Iphone 15PRo max", description: "Product title" })
  @Column({ type: DataType.STRING })
  title: string;

  @ApiProperty({
    example: "Iphone 15PRo max",
    description: "Product description",
  })
  @Column({ type: DataType.TEXT })
  description: string;

  @ApiProperty({ example: "200", description: "Product Count" })
  @Column({ type: DataType.INTEGER })
  count: number;

  @ApiProperty({ example: "200.23", description: "Product price" })
  @Column({ type: DataType.FLOAT })
  price: number;

  @ApiProperty({ example: "true", description: "Product status" })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  status: boolean;

  @ApiProperty({ example: "2", description: "Category ID" })
  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => Category)
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;


}
