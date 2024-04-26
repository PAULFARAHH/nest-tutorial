import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Delete, Param, Put } from '@nestjs/common';
import { AppointmentService } from './appointment.service'
import { Appointments, Status } from '@prisma/client';
import { PatientGuard } from 'src/Guards/patient.guards';

@Controller('appointment')
export class AppointmentController {
    constructor(private readonly AppointmentService: AppointmentService) { }
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

