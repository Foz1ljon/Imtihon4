import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsDate, IsOptional } from "class-validator";

export class UpdatePurchaseDto {
  @ApiProperty({ example: "1", description: "customer ID" })
  @IsOptional()
  @IsNumberString()
  customer_id: number;

  @ApiProperty({ example: "1", description: "product ID" })
  @IsOptional()
  @IsNumberString()
  product_id: number;

  @ApiProperty({ example: "40000", description: "All Sum" })
  @IsOptional()
  @IsNumberString()
  total_amount: number;

  @ApiProperty({ example: "5", description: "Percent" })
  @IsOptional()
  @IsNumberString()
  interest_rate: number;

  @ApiProperty({ example: "11", description: "Date " })
  @IsOptional()
  @IsNumberString()
  installmentDuration: number;

  @ApiProperty({ example: "06", description: "Payment Date Number" })
  @IsOptional()
  @IsNumberString()
  paymentDay: number;
}
