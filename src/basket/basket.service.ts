import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBasketDto } from "./dto/create-basket.dto";
import { UpdateBasketDto } from "./dto/update-basket.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Basket } from "./models/basket.model";
import { Product } from "../product/model/product.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private readonly basketRepo: typeof Basket,
    private readonly jwtService: JwtService,
  ) {}
  async create(createBasketDto: CreateBasketDto, refreshToken: string) {
    const productId = await Product.findByPk(createBasketDto.product_id);
    if (!productId) throw new NotFoundException(" Product not found");
    const findBasket = await Basket.findByPk(createBasketDto.product_id);
    if (!findBasket) throw new BadRequestException("Product already exists");
    const decodedToken = this.jwtService.decode(refreshToken);

    return this.basketRepo.create({
      ...createBasketDto,
      customer_id: decodedToken["id"],
    });
  }

  findAll(refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);

    return this.basketRepo.findAll({
      include: { all: true },
      where: { id: req["id"] },
    });
  }

  findById(id: number, refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);

    return this.basketRepo.findOne({ where: { customer_id: req["id"], id } });
  }

  async update(
    id: number,
    updateBasketDto: UpdateBasketDto,
    refreshToken: string,
  ) {
    const customer = this.jwtService.decode(refreshToken);

    const data = await this.basketRepo.update(updateBasketDto, {
      where: { id: id, customer_id: customer["id"] },
      returning: true,
    });

    return data[1][0];
  }

  remove(id: number, refreshToken: string) {
    const customer = this.jwtService.decode(refreshToken);

    return this.basketRepo.destroy({
      where: { id: id, customer_id: customer["id"] },
    });
  }
}
