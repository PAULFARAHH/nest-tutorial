
import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service'; // Import DoctorService here
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AppointmentService, PrismaService], // Provide PrismaService
  exports: [AppointmentService], controllers: [AppointmentController],
})
export class AppointmentModule { }

