import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "../admin/model/admin.model";

@Injectable()
export class CreatorGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException("User unauthorized");

      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];
      if (bearer !== "Bearer" || !token)
        throw new UnauthorizedException("User unauthorized");

      try {
        const user: Partial<Admin> = await this.jwtService.verify(token, {
          secret: process.env.accesstokenkey,
        });

        if (!user) throw new UnauthorizedException("Invalid token provided");
        if (!user.active || !user.is_owner)
          throw new UnauthorizedException("User is not active");

        return true;
      } catch (error) {
        throw new UnauthorizedException("Invalid token provided");
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid token provided");
    }
  }
}
