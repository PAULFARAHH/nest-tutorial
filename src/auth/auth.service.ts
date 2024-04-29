import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '.prisma/client'; // Import Prisma User type
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,

  ) { }

  generateSalt(): string {
    return randomBytes(4).toString('hex');
  }

  hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(password + salt).digest('hex');
  }

  async createUser(username: string, password: string, salt: string, role: string): Promise<User> {
    if (role === "doctor") {

      await this.prisma.doctors.create({
        data: {
          name: username,
          department_id: 1 // existed in the department table
        },
      })

    };
    if (role === "patient") {
      await this.prisma.patients.create({
        data: {
          name: username,
          doctor_id: 1 // existed in the department table
        }
      })
    }
    return this.prisma.user.create({
      data: {
        username,
        password: password,
        salt,
        role: role,
      },
    });
  }


  async signUp(username: string, password: string, role: string): Promise<any> {
    const salt = this.generateSalt();
    const hashedPassword = this.hashPassword(password, salt);

    const user = await this.createUser(username, hashedPassword, salt, role);

    return user;
  }


  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Hash the provided password using the user's salt
    const hashedPassword = this.hashPassword(password, user.salt);
    console.log(createHash('sha256').update(password).digest('hex'));
    // Compare the hashed password with the stored hashed password
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      role: user.role,
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
