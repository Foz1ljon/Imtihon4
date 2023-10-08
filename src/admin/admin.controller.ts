import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,

  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Admin } from "./model/admin.model";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
import { FindAdminDto } from "./dto/find-admin.dto";
import { CreatorGuard } from "../guards/creator.guard";

@ApiTags("Admins")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiOperation({ summary: "register Customer" })
  // @UseGuards(CreatorGuard)
  @Post("signup")
  create(
    @Body() createAdminDto: CreateAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.register(createAdminDto, res);
  }

  @ApiOperation({ summary: "activate admin" })
  @ApiResponse({ status: 200, type: [Admin] })
  @Get("activate:link")
  activate(@Param("link") link: string) {
    return this.adminService.activate(link);
  }

  @ApiOperation({ summary: "login User" })
  @Post("signin")
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: "logout admin" })
  @ApiResponse({ status: 200, type: Admin })
/*   @UseGuards(AdminGuard) */
  @HttpCode(HttpStatus.OK)
  @Post("signout")
  logout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: "Refresh token" })
  @Post(":id/refresh")
/*   @UseGuards(AdminGuard) */
  refresh(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.refreshToken(+id, refreshToken, res);
  }

  @UseGuards(CreatorGuard)
  @ApiOperation({ summary: "Search Admin" })
  @Post("find")
  findAll(
    @Body() findAdminDto: FindAdminDto,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.findAll(findAdminDto);
  }

  @ApiOperation({ summary: "Edit Admin Value by ID" })
 /*  @UseGuards(CreatorGuard) */
  @Put(":id")
  updateAdmin(@Param("id") id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdminById(+id, updateAdminDto);
  }
}
