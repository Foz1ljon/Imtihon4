import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString } from "class-validator";
export class UpdateProductDto {
  @ApiProperty({ example: "product.jpg", description: "product photo" })
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty({ example: "this is product", description: "product title" })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ example: "product about", description: "product description" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: "40", description: "product count" })
  @IsNumber()
  @IsOptional()
  count: number;

  @ApiProperty({ example: "600000", description: "product price" })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ example: "2", description: "category ID" })
  @IsNumber()
  @IsOptional()
  category_id: number;
}
