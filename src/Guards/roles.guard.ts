import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      console.log(payload.sub);
      // Assign the payload to the request object
      request['user'] = payload;
      if (payload.role != "admin") {
        return false
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log("aaaaaab");
        // If the token is expired, update it in the database
        await this.userService.deleteToken(token); // Assuming you have a method to clear the token by its value
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
