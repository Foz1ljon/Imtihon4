import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsDate } from "class-validator";

export class CreatePurchaseDto {
  @ApiProperty({ example: "1", description: "customer ID" })
  @IsNumberString()
  customer_id: number;

  @ApiProperty({ example: "1", description: "product ID" })
  @IsNumberString()
  product_id: number;

  @ApiProperty({ example: "5", description: "Percent" })
  @IsNumberString()
  interest_rate: number;

  @ApiProperty({ example: "11", description: "Date " })
  @IsNumberString()
  installmentDuration: number;

  @ApiProperty({ example: "06", description: "Payment Date Number" })
  @IsNumberString()
  paymentDay: number;

 
}
