import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Customer } from "../customers/model/customer.model";
import { Admin } from "../admin/model/admin.model";

@Injectable()
export class CustomerGuard implements CanActivate {
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
        const user: Partial<Customer> = await this.jwtService.verify(token, {
          secret: process.env.access_token_key,
        });

        if (!user) throw new UnauthorizedException("Invalid token provided");
        if (!user.is_active)
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

// @Injectable()
// export class AdminGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}
//   async canActivate(context: ExecutionContext) {
//     try {
//       const req = context.switchToHttp().getRequest();
//       const authHeader = req.headers.authorization;
//       if (!authHeader) throw new UnauthorizedException("User unauthorized");

//       const bearer = authHeader.split(" ")[0];
//       const token = authHeader.split(" ")[1];
//       if (bearer !== "Bearer" || !token)
//         throw new UnauthorizedException("User unauthorized");
//       try {
//         const user = this.jwtService.verify(token, {
//           secret: process.env.accesstokenkey,
//         });

//         if (!user) throw new UnauthorizedException("Invalid token provided");
//         if (!user.active)
//           throw new UnauthorizedException("User is not active1");

//         return true;
//       } catch (error) {
//         throw new UnauthorizedException("Invalid token provided");
//       }
//     } catch (error) {
//       throw new UnauthorizedException("Invalid token provided");
//     }
//   }
// }
