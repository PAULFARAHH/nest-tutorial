import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service'; // Import DoctorService here
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [PatientService, PrismaService], // Provide PrismaService
    exports: [PatientService], controllers: [PatientController],
})
export class PatientModule { }

