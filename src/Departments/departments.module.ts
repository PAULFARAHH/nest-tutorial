import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { DepartmentService } from './department.service';
import { AppointmentService } from 'src/Appointment/appointment.service';

@Module({
  imports: [UsersModule],
  providers: [DepartmentService, AppointmentService, PrismaService], // Provide PrismaService
  exports: [DepartmentService], controllers: [DepartmentsController],
})
export class DepartmentsModule { }
