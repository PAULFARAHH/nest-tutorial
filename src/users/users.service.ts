// users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '.prisma/client'; // Import Prisma type

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(username: string): Promise<User | null> {

    const a = this.prisma.user.findUnique({
      where: { username: username } as Prisma.UserWhereUniqueInput, // Explicitly specify the type
    });
    console.log("user= " + a);

    return a;
  }
  async findIdByToken(token: string): Promise<User | null> {
    const a = this.prisma.user.findUnique({
      where: { token: token } as Prisma.UserWhereUniqueInput,
    });
    return a;
  }

  async updateToken(userId: number, newtoken: string): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data: { token: newtoken },
    });
  }
  async deleteToken(token: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: { token: token },
      data: { token: "null" }, // Set token to null to delete it
    });


    // async deleteToken(oldToken: string): Promise<void> {
    //   const user = await this.prisma.user.findFirst({
    //     where: { token: oldToken }, // Search for a user with the old token
    //   });

    //   if (user) {
    //     await this.prisma.user.update({
    //       where: { userId: user.userId }, // Use the user's ID to uniquely identify the user
    //       data: { token: "null" }, // Update the token to the new value
    //     });
    //   } else {
    //     console.log("User with the specified token does not exist.");
    //   }
    // }



  }
}

// Optionally, handle any cleanup or error checking here





