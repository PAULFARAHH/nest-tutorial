import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Param, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Appointments, Doctors, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { PatientGuard } from 'src/Guards/patient.guards';

@Controller('patients')
export class PatientController {
    AppointmentService: any;
    constructor(private readonly patientService: PatientService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK)// task4
    @UseGuards(RoleGuard)
    @Post("Add")
    async createPatient(@Body() patientData: Patients) {
        return this.patientService.createPatient(patientData);
    }

    @HttpCode(HttpStatus.OK) //task4
    @UseGuards(PatientGuard)
    @Post("AddDoctor")
    async assignDoctor(@Body() patientData: Patients) {

        return this.patientService.assignDoctor(patientData.patient_id, patientData.doctor_id);
    }
    @Get(':id/doctor')  //task5 get assigned doctor
    @UseGuards(PatientGuard)
    async getAssignedDoctor(@Param('id') patientId: string) {
        const parsedPatientId = parseInt(patientId, 10);
        const doctor = await this.patientService.getAssignedDoctor(parsedPatientId);
        if (!doctor) {
            throw new NotFoundException(`No assigned doctor found for patient with id ${patientId}`);
        }
        return doctor;
    }

    //patient manipulating with appointment

    @HttpCode(HttpStatus.OK)// task5 schedule an appointment
    @UseGuards(PatientGuard)
    @Post("Add") //verified
    async scheduleAppointment(@Body() appointmentData: Appointments) {
        return this.patientService.scheduleAppointment(appointmentData);
    }
    @HttpCode(HttpStatus.OK)  // task5 cancel an appointment
    @UseGuards(PatientGuard)
    @Delete(':id')
    async cancelAppointment(@Param('id') id: string) {
        const formattedId = parseInt(id, 10);
        return this.patientService.cancelAppointment(formattedId);
    }

    @HttpCode(HttpStatus.OK)  // change appointment status
    @UseGuards(PatientGuard)
    @Put(':id/status')
    async changeAppointmentStatus(@Param('id') id: string, @Body('status') status: Status) {
        const formattedId = parseInt(id, 10);
        return this.patientService.changeAppointmentStatus(formattedId, status);
    }

    @Get() //task5 pagination
    //@UseGuards(RoleGuard)
    async findAll(@Query('skip') skip?: number, @Query('take') take?: string): Promise<{ patients: Patients[], doctors: Doctors[] }> {
        return this.patientService.getAllPatientsAndDoctors(skip, take);
    }


}
