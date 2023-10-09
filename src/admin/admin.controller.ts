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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Admin } from "./model/admin.model";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
import { FindAdminDto } from "./dto/find-admin.dto";
import { CreatorGuard } from "../guards/creator.guard";
import { Roles } from "../decorators/roles-auth.decorator";
import { RolesGuard } from "../guards/role.guard";
import { AddRoleDto } from "./dto/addrole-dto";

@ApiTags("Admins")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiOperation({ summary: "register Customer" })
  @UseGuards(CreatorGuard)
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
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @ApiResponse({ status: 200, type: Admin })
  @HttpCode(HttpStatus.OK)
  @Post("signout")
  logout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: "Refresh token" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Post(":id/refresh")
  refresh(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.refreshToken(+id, refreshToken, res);
  }

  @ApiOperation({ summary: "Search Admin" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Roles("SUPERADMIN")
  @UseGuards(RolesGuard)
  @Post("find")
  findAll(
    @Body() findAdminDto: FindAdminDto,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.findAll(findAdminDto);
  }

  @ApiOperation({ summary: "Edit Admin Value by ID" })
  @ApiBearerAuth()
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put(":id")
  updateAdmin(@Param("id") id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdminById(+id, updateAdminDto);
  }

  @ApiOperation({ summary: "Add Role" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Post("add_role")
  AddRole(@Body() addRoleDto: AddRoleDto) {
    return this.adminService.addRole(addRoleDto);
  }

  @ApiOperation({ summary: "Remove Role" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Post("remove_role")
  RemoveRole(@Body() addRoleDto: AddRoleDto) {
    return this.adminService.removeRole(addRoleDto);
  }
}
