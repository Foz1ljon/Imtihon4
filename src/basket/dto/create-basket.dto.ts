import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateBasketDto {


  @ApiProperty({ example: "1", description: "Product ID" })
  @IsNotEmpty()
  @IsNumberString()
  product_id: number;
}
