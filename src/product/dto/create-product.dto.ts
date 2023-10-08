import { ApiProperty } from "@nestjs/swagger";
import {
  IsAscii,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "product.jpg", description: "product photo" })
  photo: string;

  @ApiProperty({ example: "this is product", description: "product title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "product about", description: "product description" })
  @IsString()
  description: string;

  @ApiProperty({ example: "40", description: "product count" })
  @IsNumberString()
  count: number;

  @ApiProperty({ example: "600000", description: "product price" })
  @IsNumberString()
  price: number;

  @ApiProperty({ example: "2", description: "category ID" })
  @IsNumberString()
  category_id: number;
}
