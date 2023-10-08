import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Product } from "../../product/model/product.model";

interface CreateCategoryAttr {
  name: string;
}
@Table({ tableName: "categories", timestamps: false })
export class Category extends Model<Category, CreateCategoryAttr> {
  @ApiProperty({ example: "3", description: " unikal ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Smartfonlar", description: "Category Name" })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
