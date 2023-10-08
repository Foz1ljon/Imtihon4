import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateHistoryDto {
  @ApiProperty({ example: "1", description: "Customer ID" })
  @IsNumberString()
  customer_id: number;

  @ApiProperty({ example: "1", description: "Purchase ID" })
  @IsNumberString()
  purchase_id: number;

  @ApiProperty({ example: "19999", description: "payment Summa" })
  @IsNumberString()
  payment: number;
  @IsString()
  @ApiProperty({ example: "[cash, card]", description: "payment type" })
  pay_type: string;
}
