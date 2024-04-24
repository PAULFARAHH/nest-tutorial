import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Patients } from '@prisma/client'; // Import the Doctor type from Prisma


@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard)
    @Post("Add")
    async createPatient(@Body() patientData: Patients) {
        return this.patientService.createPatient(patientData);
    }

    @HttpCode(HttpStatus.OK)
    @Post("AddDoctor")
    async assignDoctor(@Body() patientData: Patients) {

        return this.patientService.assignDoctor(patientData.patient_id, patientData.doctor_id);
    }

}
