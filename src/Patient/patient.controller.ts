import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Param, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Param, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Appointments, Doctors, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { PatientGuard } from 'src/Guards/patient.guards';
import { Appointments, Doctors, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { PatientGuard } from 'src/Guards/patient.guards';

@Controller('patients')
export class PatientController {
    AppointmentService: any;
    AppointmentService: any;
    constructor(private readonly patientService: PatientService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK)// task4
    @HttpCode(HttpStatus.OK)// task4
    @UseGuards(RoleGuard)
    @Post("Add")
    async createPatient(@Body() patientData: Patients) {
        return this.patientService.createPatient(patientData);
    }

    @HttpCode(HttpStatus.OK) //task4
    @UseGuards(PatientGuard)
    @HttpCode(HttpStatus.OK) //task4
    @UseGuards(PatientGuard)
    @Post("AddDoctor")
    async assignDoctor(@Body() patientData: Patients) {

        return this.patientService.assignDoctor(patientData.patient_id, patientData.doctor_id);
    }
 

    //patient manipulating with appointment

   



}
