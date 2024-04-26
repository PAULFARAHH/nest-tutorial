import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Param, Get, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Doctors } from '@prisma/client'; // Import the Doctor type from Prisma
import { Appointments } from '@prisma/client'; // Import the Appointment type from Prisma
import { DoctorGuard } from 'src/Guards/doctor.guards';

@Controller('doctors')
export class DoctorController {
    prisma: any;
    constructor(private readonly doctorService: DoctorService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK) // task4
    @UseGuards(RoleGuard)

    @Post("Add")
    async createDoctor(@Body() doctorData: Doctors) {
        return this.doctorService.createDoctor(doctorData);
    }

    @HttpCode(HttpStatus.OK) // task 5 approve appointment
    @UseGuards(DoctorGuard)
    @Post(':id/approve/:appointmentId')
    async approveAppointment(@Param('id') doctorId: string, @Param('appointmentId') appointmentId: string) {
        const parsedDoctorId = parseInt(doctorId, 10); // Convert the string to a number
        const parsedAppointmentId = parseInt(appointmentId, 10); // Convert the string to a number
        return this.doctorService.approveAppointment(parsedDoctorId, parsedAppointmentId);
    }


    @HttpCode(HttpStatus.OK) // task5 reject appointment
    @UseGuards(DoctorGuard)
    @Post(':id/reject/:appointmentId')
    async rejectAppointment(@Param('id') doctorId: string, @Param('appointmentId') appointmentId: string) {
        const parsedDoctorId = parseInt(doctorId, 10);
        const parsedAppointmentId = parseInt(appointmentId, 10);
        return this.doctorService.rejectAppointment(parsedDoctorId, parsedAppointmentId);
    }
    @Get(':id/appointments')  // task5 get appointments for a specific doctor
    @UseGuards(DoctorGuard)
    async getAppointmentsForDoctor(@Param('id') doctorId: string): Promise<Appointments[]> {
        const parsedDoctorId = parseInt(doctorId, 10);
        try {
            const appointments = await this.doctorService.getAppointmentsForDoctor(parsedDoctorId);
            if (!appointments || appointments.length === 0) {
                throw new NotFoundException(`No appointments found for doctor with ID ${doctorId}`);
            }
            return appointments;
        } catch (error) {
            throw new NotFoundException(`Error retrieving appointments for doctor with ID ${doctorId}: ${error.message}`);
        }
    }


}
