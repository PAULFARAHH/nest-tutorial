
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Delete, Param, Put, Get, Query, NotFoundException } from '@nestjs/common';
import { AppointmentService } from './appointment.service'
import { Appointments, Patients, Status } from '@prisma/client';
import { PatientGuard } from 'src/Guards/patient.guards';
import { DoctorGuard } from 'src/Guards/doctor.guards';
import { RoleGuard } from 'src/Guards/roles.guard';




@Controller('appointment')
export class AppointmentController {
    constructor(private readonly AppointmentService: AppointmentService) { }


    // @UseGuards(RoleGuard)
    @HttpCode(HttpStatus.OK) //http://localhost:3000/appointment/Add
    @Post("Add")
    async scheduleAppointment(@Body() appointmentData: Appointments) {
        return this.AppointmentService.scheduleAppointment(appointmentData);
    }
    //@UseGuards(PatientGuard)
    @Get('patient/:patientId')// get all the appoitments of a specific patient
    async getAppointmentsByPatientIdAndDateRange(
        @Param('patientId') patientId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        // Call the service to get appointments
        return this.AppointmentService.getAppointmentsByPatientIdAndDateRange(
            parseInt(patientId),
            "patient",
            startDate,
            endDate,
        );
    }
    @UseGuards(PatientGuard)
    @Get(':id/doctor')  //task5 get assigned doctor
    @UseGuards(PatientGuard)
    async getAssignedDoctor(@Param('id') patientId: string) {
        const parsedPatientId = parseInt(patientId, 10);
        const doctor = await this.AppointmentService.getAssignedDoctor(parsedPatientId);
        if (!doctor) {
            throw new NotFoundException(`No assigned doctor found for patient with id ${patientId}`);
        }
        return doctor;
    }
    @UseGuards(PatientGuard)
    @HttpCode(HttpStatus.OK)  // task5 cancel an appointment
    @UseGuards(PatientGuard)
    @Delete(':id')
    async cancelAppointment(@Param('id') id: string) {
        const formattedId = parseInt(id, 10);
        return this.AppointmentService.cancelAppointment(formattedId);
    }

    @HttpCode(HttpStatus.OK)  // change appointment status
    @UseGuards(PatientGuard)
    @Put(':id/status')
    async changeAppointmentStatus(@Param('id') id: string, @Body('status') status: Status) {
        const formattedId = parseInt(id, 10);
        return this.AppointmentService.changeAppointmentStatus(formattedId, status);
    }


    @UseGuards(RoleGuard)
    @Get() //task5 pagination
    @UseGuards(RoleGuard)
    async findAll(@Query('skip') skip?: number, @Query('take') take?: string): Promise<{ patients: Patients[] }> {
        return this.AppointmentService.getAllPatientsAndDoctors(skip, take);
    }

    //doctor
    @UseGuards(DoctorGuard) //get all the appoitments of a specific doctor
    @Get('doctor/:doctorId') //http://localhost:3000/appointment/doctor/1?startDate=2024-05-01T10:00:00Z&endDate=2024-05-01T15:00:00Z
    async getAppointmentsByDocotrIdAndDateRange(
        @Param('doctorId') patientId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {


        // Call the service to get appointments
        return this.AppointmentService.getAppointmentsByPatientIdAndDateRange(
            parseInt(patientId),
            "doctor",
            startDate,
            endDate,
        );
    }

    @UseGuards(DoctorGuard)
    @HttpCode(HttpStatus.OK) // task 5 approve appointment
    @UseGuards(DoctorGuard)
    @Post(':id/approve/:appointmentId')
    async approveAppointment(@Param('id') doctorId: string, @Param('appointmentId') appointmentId: string) {
        const parsedDoctorId = parseInt(doctorId, 10); // Convert the string to a number
        const parsedAppointmentId = parseInt(appointmentId, 10); // Convert the string to a number
        return this.AppointmentService.approveAppointment(parsedDoctorId, parsedAppointmentId);
    }
    @UseGuards(DoctorGuard)
    @HttpCode(HttpStatus.OK) // task5 reject appointment
    @UseGuards(DoctorGuard)
    @Post(':id/reject/:appointmentId')
    async rejectAppointment(@Param('id') doctorId: string, @Param('appointmentId') appointmentId: string) {
        const parsedDoctorId = parseInt(doctorId, 10);
        const parsedAppointmentId = parseInt(appointmentId, 10);
        return this.AppointmentService.rejectAppointment(parsedDoctorId, parsedAppointmentId);
    }


    // @HttpCode(HttpStatus.OK)
    // @Post("Add") //verified
    // async scheduleAppointment(@Body() appointmentData: Appointments) {
    //     return this.AppointmentService.scheduleAppointment(appointmentData);
    // }
    // @HttpCode(HttpStatus.OK)
    // @Delete(':id')
    // async cancelAppointment(@Param('id') id: string) {
    //     const formattedId = parseInt(id, 10);
    //     return this.AppointmentService.cancelAppointment(formattedId);
    // }

    // @HttpCode(HttpStatus.OK)
    // @Put(':id/status')
    // async changeAppointmentStatus(@Param('id') id: string, @Body('status') status: Status) {
    //     const formattedId = parseInt(id, 10);
    //     return this.AppointmentService.changeAppointmentStatus(formattedId, status);
    //}

}

