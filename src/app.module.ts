import { Module } from '@nestjs/common';
import { DepartmentsModule } from './departments/departments.module';
import { DoctorModule } from './doctor/doctor.module';
// import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientModule } from './Patient/patient.module';

@Module({
  imports: [
    DepartmentsModule,
    DoctorModule,
    PatientModule,
    //PatientModule,
    AppointmentModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule { }
