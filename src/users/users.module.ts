import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Import PrismaService
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService], // Provide PrismaService
  exports: [UsersService], controllers: [UsersController], // Export UsersService if needed by other modules
})
export class UsersModule { }
