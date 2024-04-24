import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RoleGuard } from '../Guards/roles.guard';
import { Doctors } from '@prisma/client'; // Import the Doctor type from Prisma

@Controller('doctors')
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) { }

    //@UseGuards(RoleGuard) // Apply RoleGuard to restrict access to admins
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard)

    @Post("Add")
    async createDoctor(@Body() doctorData: Doctors) {
        return this.doctorService.createDoctor(doctorData);
    }
}
