import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Param, Get, NotFoundException } from '@nestjs/common';
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Param, Get, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Doctors } from '@prisma/client'; // Import the Doctor type from Prisma
import { Appointments } from '@prisma/client'; // Import the Appointment type from Prisma
import { DoctorGuard } from 'src/Guards/doctor.guards';
import { Appointments } from '@prisma/client'; // Import the Appointment type from Prisma
import { DoctorGuard } from 'src/Guards/doctor.guards';

@Controller('doctors')
export class DoctorController {
    prisma: any;
    prisma: any;
    constructor(private readonly doctorService: DoctorService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK) // task4
    @HttpCode(HttpStatus.OK) // task4
    @UseGuards(RoleGuard)

    @Post("Add")
    async createDoctor(@Body() doctorData: Doctors) {
        return this.doctorService.createDoctor(doctorData);
    }




}
