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
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminGuard, CustomerGuard } from "../guards/Auth.guard";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
@ApiTags("Histories")
@Controller("history")
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
  findAll( @CookieGetter("refresh_token") refreshToken: string,) {
    return this.historyService.findAll(refreshToken);
  }
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all  history" })
  @Get("all")
  findAllCustomer() {
    return this.historyService.findAllCustomer();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.historyService.findById(+id);
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.historyService.remove(+id);
  }
}
