import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Admin } from "./model/admin.model";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { FindAdminDto } from "./dto/find-admin.dto";
import { Op } from "sequelize";
import { AddRoleDto } from "./dto/addrole-dto";
import { Role } from "../role/models/role.models";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async getToken(admin: Admin) {
    const jwtPayload = {
      id: admin.id,
      active: admin.active,
      is_owner: admin.is_owner,
      roles: admin.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.accesstokenkey,
        expiresIn: process.env.access_token_time,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.refresh_token_key,
        expiresIn: process.env.refresh_token_time,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(createAdminDto: CreateAdminDto, res: Response) {
    const user = await this.adminRepo.findOne({
      where: { email: createAdminDto.email },
    });
    const user1 = await this.adminRepo.findOne({
      where: { username: createAdminDto.username },
    });
    if (user || user1)
      throw new BadRequestException("Email or Username already registered");
    if (createAdminDto.password !== createAdminDto.confirm_password)
      throw new BadRequestException("Passport is not match");

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newUser = await this.adminRepo.create({
      ...createAdminDto,
      password: hashed_password,
    });
    const role = await Role.findOne({ where: { value: "ADMIN" } });

    if (!role) {
      throw new BadRequestException("Role not found");
    }
    await newUser.$set("roles", [role.id]);
    await newUser.save();
    newUser.roles = [role];
    const tokens = await this.getToken(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = v4();

    const UpdatedUser = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
        activation_link: uniqueKey,
      },
      { where: { id: newUser.id }, returning: true },
    );

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    try {
      await this.mailService.sendAdminConfirmation(UpdatedUser[1][0]);
    } catch (error) {
      console.log(error);
    }

    const response = {
      message: "Admin registration",
      user: UpdatedUser[1][0],
      tokens,
    };

    return response;
  }

  async activate(link: string) {
    if (!link) throw new BadRequestException("Activation link not found");
    const updatedUser = await this.adminRepo.update(
      { active: true },
      { where: { activation_link: link, active: false }, returning: true },
    );

    if (!updatedUser) throw new BadRequestException("User already activated");

    const response = {
      message: "User activated successfully",
      user: updatedUser,
    };
    return response;
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    const user = await this.adminRepo.findOne({
      where: { email: loginAdminDto.email },
    });

    if (!user) throw new BadRequestException("Invalid Email or password");
    const compare = await bcrypt.compare(loginAdminDto.password, user.password);
    if (!compare) throw new UnauthorizedException("Invalid Email or password");
    if (!user.active) throw new BadRequestException("User is not active");

    const tokens = await this.getToken(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    const UpdatedUser = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      { where: { id: user.id }, returning: true },
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User logged in successfully",
      user: UpdatedUser[1][0],
      tokens,
    };

    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const UserData = await this.jwtService.verify(refreshToken, {
      secret: process.env.refresh_token_key,
    });
    if (!UserData) throw new ForbiddenException("User not found");
    const updateUser = await this.adminRepo.update(
      { hashed_refresh_token: null },
      { where: { id: UserData.id }, returning: true },
    );

    res.clearCookie("refresh_token");
    const response = {
      message: "User logged out Successfully",
      user: updateUser[1][0],
    };
    return response;
  }

  /*  Tokenni  yangilash qismi */
  async refreshToken(user_id: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (user_id != decodedToken["id"])
      throw new BadRequestException("user not found");
    const user = await this.adminRepo.findOne({ where: { id: user_id } });
    if (!user || !user.hashed_refresh_token)
      throw new BadRequestException("user not found");
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokenMatch) throw new ForbiddenException("Forbidden");

    const tokens = await this.getToken(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const UpdatedUser = await this.adminRepo.update(
      {
        hashed_refresh_token: hashed_refresh_token,
      },
      { where: { id: user.id }, returning: true },
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: "Successfully refreshed token",
      user: UpdatedUser[1][0],
      tokens,
    };

    return response;
  }

  /* Admin search For Creator */
  async findAll(findAdminDto: FindAdminDto) {
    const where = {};
    if (findAdminDto.email) {
      where["email"] = {
        [Op.like]: `%${findAdminDto.email}%`,
      };
    }

    if (findAdminDto.username) {
      where["username"] = {
        [Op.like]: `%${findAdminDto.username}%`,
      };
    }
    const users = await Admin.findAll({ where, include: { all: true } });

    if (!users) throw new BadRequestException("User not found");
    return users;
  }

  /* Remove admin by ID */
  async removeAdminById(id: number) {
    const data = await this.adminRepo.findByPk(id);
    if (!data) throw new NotFoundException("Admin not found");
    return this.adminRepo.destroy({ where: { id } });
  }
  /* Update Admin by ID */
  async updateAdminById(id: number, updateAdminDto: UpdateAdminDto) {
    const data = await this.adminRepo.update(updateAdminDto, {
      where: { id },
      returning: true,
    });

    return data[1][0];
  }

  async addRole(addRoleDto: AddRoleDto) {
    const user = await Admin.findByPk(addRoleDto.admin_id);
    const role = await Role.findOne({ where: { value: addRoleDto.value } });
    if (role && user) {
      await user.$add("roles", role.id);
      const updated = await this.adminRepo.findByPk(addRoleDto.admin_id, {
        include: { all: true },
      });
      return updated;
    }
    throw new HttpException("User or role not found", HttpStatus.NOT_FOUND);
  }
  async removeRole(addRoleDto: AddRoleDto) {
    const user = await Admin.findByPk(addRoleDto.admin_id);
    const role = await Role.findOne({ where: { value: addRoleDto.value } });
    if (role && user) {
      await user.$remove("roles", role.id);
      const updated = await this.adminRepo.findByPk(addRoleDto.admin_id, {
        include: { all: true },
      });
      return updated;
    }
    throw new HttpException("User or role not found", HttpStatus.NOT_FOUND);
  }
}
