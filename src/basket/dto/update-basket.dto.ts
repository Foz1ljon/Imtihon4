import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateBasketDto } from "./create-basket.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBasketDto {
  @ApiProperty({ example: "1", description: "Product ID" })
  @IsNotEmpty()
  @IsNumberString()
  product_id: number;
}
