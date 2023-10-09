import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpCode,
  UseGuards,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { Customer } from "./model/customer.model";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
import { FindCustomerDto } from "./dto/find-customer.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CustomerGuard } from "../guards/Auth.guard";
import { RolesGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles-auth.decorator";
@ApiTags("Customers")
@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: "register Customer" })
  @Post("signup")
  create(
    @Body() createUserDto: CreateCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.register(createUserDto, res);
  }

  @ApiOperation({ summary: "activate customer" })
  @ApiResponse({ status: 200, type: [Customer] })
  @Get("activate:link")
  activate(@Param("link") link: string) {
    return this.customersService.activate(link);
  }

  @ApiOperation({ summary: "login User" })
  @Post("signin")
  login(
    @Body() loginCustomerDto: LoginCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.login(loginCustomerDto, res);
  }

  @ApiOperation({ summary: "logout customer" })
  @ApiResponse({ status: 200, type: Customer })
  @UseGuards(CustomerGuard)
  @HttpCode(HttpStatus.OK)
  @Post("signout")
  logout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: "Refresh token" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @UseGuards(CustomerGuard)
  @Post(":id/refresh")
  refresh(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.refreshToken(+id, refreshToken, res);
  }

  @ApiOperation({ summary: "Get me by id" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Get("getme")
  findme(@CookieGetter("refresh_token") refreshToken: string) {
    return this.customersService.getme(refreshToken);
  }

  @ApiOperation({ summary: "Search Customer" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("find")
  findAll(
    @Body() findCustomerDto: FindCustomerDto,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.findAll(findCustomerDto);
  }

  @ApiOperation({ summary: "Remove Customer by Id" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete("remove/:id")
  Remove(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customersService.remove(+id);
  }
  @ApiOperation({ summary: "Update Customer" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @UseGuards(CustomerGuard)
  @Put("update")
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFile() image: any,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.customersService.update(updateCustomerDto, image, refreshToken);
  }
}
