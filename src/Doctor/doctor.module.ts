import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service'; // Import DoctorService here
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [DoctorService, PrismaService], // Provide PrismaService
  exports: [DoctorService], controllers: [DoctorController],
})
export class DoctorModule { }

