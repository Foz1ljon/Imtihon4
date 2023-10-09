import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { HistoryService } from "./history.service";
import { CreateHistoryDto } from "./dto/create-history.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CustomerGuard } from "../guards/Auth.guard";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
import { Roles } from "../decorators/roles-auth.decorator";
import { RolesGuard } from "../guards/role.guard";
@ApiTags("Histories")
@Controller("history")
@ApiBearerAuth()
@ApiHeader({
  name: "Authorization",
  description: "Bearer token",
})
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @ApiOperation({ summary: "Get all my history" })
  @UseGuards(CustomerGuard)
  @Post()
  create(
    @Body() createHistoryDto: CreateHistoryDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.historyService.create(createHistoryDto, refreshToken);
  }

  @ApiOperation({ summary: "Get all my history" })
  @UseGuards(CustomerGuard)
  @Get()
  findAll(@CookieGetter("refresh_token") refreshToken: string) {
    return this.historyService.findAll(refreshToken);
  }
  @Roles("VENDOR", "ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Get all  history" })
  @Get("all")
  findAllCustomer() {
    return this.historyService.findAllCustomer();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.historyService.findById(+id);
  }

  @Roles("VENDOR", "ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.historyService.remove(+id);
  }
}
