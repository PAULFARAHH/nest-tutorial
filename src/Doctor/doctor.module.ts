import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { AppointmentService } from 'src/Appointment/appointment.service'; // Import AppointmentService here

@Module({
  imports: [UsersModule],
  providers: [DoctorService, PrismaService, AppointmentService], // Provide AppointmentService
  exports: [DoctorService, AppointmentService], // Export AppointmentService as well
  controllers: [DoctorController],
})
export class DoctorModule { }
