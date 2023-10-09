import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { Purchase } from "../purchase/models/purchase.model";
import { InjectModel } from "@nestjs/sequelize";
import { History } from "./models/history.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History) private readonly historyRepo: typeof History,
    private readonly jwtService: JwtService,
  ) {}
  async create(createHistoryDto: CreateHistoryDto, refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);

    const purchase = await Purchase.findOne({
      where: { id: createHistoryDto.purchase_id, customer_id: req["id"] },
    });
    if (!purchase) throw new NotFoundException("Purchase not found");

    const data = await History.findOne({ where: { customer_id: req["id"] } });

    return this.historyRepo.create({
      ...createHistoryDto,
      customer_id: req["id"],
    });
  }

  findAll(refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);

    return this.historyRepo.findAll({
      where: { customer_id: req["id"] },
      include: { all: true },
    });
  }

  findAllCustomer() {
    return this.historyRepo.findAll();
  }

  findById(id: number) {
    return this.historyRepo.findByPk(id);
  }

  remove(id: number) {
    return this.historyRepo.destroy({ where: { id } });
  }
}
