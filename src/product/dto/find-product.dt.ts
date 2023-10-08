import { ApiProperty } from "@nestjs/swagger";

export class FindProductDto {
  @ApiProperty({ example: "this is product", description: "product title" })
  title: string;

  @ApiProperty({ example: "product about", description: "product description" })
  description: string;

  @ApiProperty({ example: "600000", description: "product price" })
  price_begin: number;

  
  @ApiProperty({ example: "600000", description: "product price" })
  price_end: number;
}
