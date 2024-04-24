import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '.prisma/client'; // Import Prisma User type

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      role: user.role // Assuming the user object has a 'role' property
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Update token in the database
    await this.usersService.updateToken(user.userId, accessToken);

    return { access_token: accessToken };
  }

  async signOut(token: string): Promise<void> {
    // Clear token in the database
    await this.usersService.deleteToken(token);
    console.log(token);
  }
}
