import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { StatusTrueDto } from "./dto/status-purchase.dto";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
import { RolesGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles-auth.decorator";
@ApiTags("Purchases")
@Controller("purchase")
@ApiBearerAuth()
@ApiHeader({
  name: "Authorization",
  description: "Bearer token",
})
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}
  @ApiOperation({ summary: "Add purchase" })
  @Roles("VENDOR")
  @UseGuards(RolesGuard)
  @Post()
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.purchaseService.create(createPurchaseDto, refreshToken);
  }
  @ApiOperation({ summary: "Add purchase" })
  @Roles("VENDOR")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }
  @ApiOperation({ summary: "Get purchase by ID" })
  @Roles("VENDOR")
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.purchaseService.findById(+id);
  }

  @ApiOperation({ summary: "Update purchase by ID" })
  @Roles("VENDOR")
  @UseGuards(RolesGuard)
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.purchaseService.update(+id, updatePurchaseDto, refreshToken);
  }

  @ApiOperation({ summary: "Deactive purchase by ID" })
  @Roles("VENDOR")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string, statusTrueDto: StatusTrueDto) {
    return this.purchaseService.remove(+id, statusTrueDto);
  }
}
