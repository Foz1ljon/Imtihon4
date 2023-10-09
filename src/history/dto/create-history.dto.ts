import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateHistoryDto {
  @ApiProperty({ example: "1", description: "Purchase ID" })
  @IsNumberString()
  purchase_id: number;
  
  @IsString()
  @ApiProperty({ example: "[cash, card]", description: "payment type" })
  pay_type: string;
}
