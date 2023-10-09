import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Purchase } from "./models/purchase.model";
import { Product } from "../product/model/product.model";
import { StatusTrueDto } from "./dto/status-purchase.dto";
import { JwtService } from "@nestjs/jwt";
import { Basket } from "../basket/models/basket.model";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase) private readonly purchaseRepo: typeof Purchase,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto, refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);
    const basket = await Basket.findOne({
      where: {
        customer_id: createPurchaseDto.customer_id,
        product_id: createPurchaseDto.product_id,
      },
    });

    const productId = await Product.findByPk(createPurchaseDto.product_id);
    if (!basket || !productId)
      throw new NotFoundException("Customer or Product not found");

    let price = productId.price;
    /* Calculate total Amount */
    let totalAmount = price + (price / 100) * createPurchaseDto.interest_rate;
    /* Calculate Payment In Month */
    let payMonth = totalAmount / createPurchaseDto.installmentDuration;

    await Basket.destroy({
      where: { customer_id: basket.id, product_id: productId.id },
    });
    return this.purchaseRepo.create({
      ...createPurchaseDto,
      admin_id: req["id"],
      total_amount: totalAmount,
      paymentMonth: payMonth,
    });
  }

  findAll() {
    return this.purchaseRepo.findAll({ include: { all: true } });
  }

  findById(id: number) {
    return this.purchaseRepo.findByPk(id, { include: { all: true } });
  }

  async update(
    id: number,
    updatePurchaseDto: UpdatePurchaseDto,
    refreshToken: string,
  ) {
    const req = this.jwtService.decode(refreshToken);
    const data = await this.purchaseRepo.update(
      {
        ...updatePurchaseDto,
        admin_id: req["id"],
      },
      {
        where: { id },
        returning: true,
      },
    );
    return data[1][0];
  }

  async remove(id: number, statusTrueDto: StatusTrueDto) {
    const data = await this.purchaseRepo.update(statusTrueDto, {
      where: { id },
      returning: true,
    });
    return data[1][0];
  }
}
