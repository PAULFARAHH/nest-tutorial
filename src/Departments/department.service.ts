import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Departments, Status } from '@prisma/client';
import { AppointmentService } from '../Appointment/appointment.service';
import { Appointments } from '@prisma/client'; // Import the Appointment type from Prisma

@Injectable()
export class DepartmentService {


    constructor(
        private readonly prisma: PrismaService,
        private readonly appointmentService: AppointmentService,
    ) { }

    async createDepartment(departmentData: Departments) { // we are obliged to put doctor_id 
        return this.prisma.departments.create({
            data: departmentData,
        });
    }

    async deleteDepartment(formattedId: number) {

        const department = await this.prisma.departments.findUnique({ where: { department_id: formattedId } });
        if (!department) {
            throw new NotFoundException(`Appointment with id ${formattedId} not found`);
        }
        return this.prisma.appointments.delete({ where: { appointment_id: formattedId } });
    }

    async updateDepartment(departmentData: { department_id: number; name: string; }) {
        return this.prisma.departments.update({
            where: { department_id: departmentData.department_id },
            data: {
                name: departmentData.name
            }
        });
    }



}
