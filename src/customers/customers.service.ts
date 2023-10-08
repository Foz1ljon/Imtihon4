import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Customer } from "./model/customer.model";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { FindCustomerDto } from "./dto/find-customer.dto";
import { Op } from "sequelize";
import { FilesService } from "../files/files.service";
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer) private readonly customerRepo: typeof Customer,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly fileService: FilesService,
  ) {}

  /* Token generate qismi */
  async getToken(customer: Customer) {
    const jwtPayload = {
      id: customer.id,
      is_active: customer.is_active,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.access_token_key,
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

  /* Customer Register qismi */
  async register(createCustomerDto: CreateCustomerDto, res: Response) {
    const user = await this.customerRepo.findOne({
      where: { email: createCustomerDto.email },
    });
    if (user) throw new BadRequestException("Email already registered");
    if (createCustomerDto.password !== createCustomerDto.confirm_password)
      throw new BadRequestException("Passport is not match");

    const hashed_password = await bcrypt.hash(createCustomerDto.password, 7);
    const newUser = await this.customerRepo.create({
      ...createCustomerDto,
      password: hashed_password,
    });

    const tokens = await this.getToken(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const uniqueKey: string = v4();

    const UpdatedUser = await this.customerRepo.update(
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
      await this.mailService.sendUserConfirmation(UpdatedUser[1][0]);
    } catch (error) {
      console.log(error);
    }

    const response = {
      message: "User registration",
      user: UpdatedUser[1][0],
      tokens,
    };

    return response;
  }

  /* Customer Activate qismi */
  async activate(link: string) {
    if (!link) throw new BadRequestException("Activation link not found");
    const updatedUser = await this.customerRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );

    if (!updatedUser) throw new BadRequestException("User already activated");

    const response = {
      message: "User activated successfully",
      user: updatedUser,
    };
    return response;
  }
  /* Customer Login qismi */
  async login(loginCustomerDto: LoginCustomerDto, res: Response) {
    const user = await this.customerRepo.findOne({
      where: { email: loginCustomerDto.email },
    });
    if (!user.is_active) throw new BadRequestException("User is not active");
    if (!user) throw new BadRequestException("Invalid Email or password");
    const compare = await bcrypt.compare(
      loginCustomerDto.password,
      user.password,
    );
    if (!compare) throw new UnauthorizedException("Invalid Email or password");

    const tokens = await this.getToken(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    const UpdatedUser = await this.customerRepo.update(
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
  async getme(refreshToken: string) {
    const customer = this.jwtService.decode(refreshToken);

    const data = await this.customerRepo.findAll({
      where: { id: customer["id"] },
      include: { all: true },
    });

    return data[0];
  }
  /* Customer LogOut qismi */
  async logout(refreshToken: string, res: Response) {
    const UserData = await this.jwtService.verify(refreshToken, {
      secret: process.env.refresh_token_key,
    });
    if (!UserData) throw new ForbiddenException("User not found");
    const updateUser = await this.customerRepo.update(
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
    const user = await this.customerRepo.findOne({ where: { id: user_id } });
    if (!user || !user.hashed_refresh_token)
      throw new BadRequestException("user not found");
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokenMatch) throw new ForbiddenException("Forbidden");

    const tokens = await this.getToken(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const UpdatedUser = await this.customerRepo.update(
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

  /* Customer Search for Admin */
  async findAll(findCustomerDto: FindCustomerDto) {
    const where = {};
    if (findCustomerDto.firstname) {
      where["firstname"] = {
        [Op.like]: `%${findCustomerDto.firstname}%`,
      };
    }
    if (findCustomerDto.lastname) {
      where["lastname"] = {
        [Op.like]: `%${findCustomerDto.lastname}%`,
      };
    }
    if (findCustomerDto.passport) {
      where["passport"] = {
        [Op.like]: `%${findCustomerDto.passport}%`,
      };
    }
    if (findCustomerDto.email) {
      where["email"] = {
        [Op.like]: `%${findCustomerDto.email}%`,
      };
    }
    if (findCustomerDto.phone) {
      where["phone"] = {
        [Op.like]: `%${findCustomerDto.phone}%`,
      };
    }

    if (findCustomerDto.birthdate_begin && findCustomerDto.birthdate_end) {
      where[Op.and] = {
        birthdate: {
          [Op.between]: [
            findCustomerDto.birthdate_begin,
            findCustomerDto.birthdate_end,
          ],
        },
      };
    } else if (findCustomerDto.birthdate_begin) {
      where["birthdate"] = {
        [Op.gte]: [findCustomerDto.birthdate_begin],
      };
    } else if (findCustomerDto.birthdate_end) {
      where["birthdate"] = {
        [Op.gte]: [findCustomerDto.birthdate_end],
      };
    }
    const users = await Customer.findAll({ where, include: { all: true } });

    if (!users) throw new BadRequestException("User not found");
    return users;
  }

  /* Remove User */
  async remove(id: number) {
    return this.customerRepo.destroy({ where: { id } });
  }

  /* Update User */
  async update(
    updateCustomerDto: UpdateCustomerDto,
    image: any,
    refreshToken: string,
  ) {
    const decodedToken = this.jwtService.decode(refreshToken);
    if (image) {
      const fileName = await this.fileService.createFile(image);
      updateCustomerDto.photo = fileName;
      const post = await this.customerRepo.update(updateCustomerDto, {
        where: { id: decodedToken["id"] },
        returning: true,
      });
      return post[1][0];
    } else {
      const post = await this.customerRepo.update(updateCustomerDto, {
        where: { id: decodedToken["id"] },
        returning: true,
      });

      return post[1][0];
    }
  }
}
