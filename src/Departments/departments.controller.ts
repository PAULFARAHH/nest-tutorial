import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Departments } from '@prisma/client';
import { DepartmentService } from './department.service';
import { RoleGuard } from 'src/Guards/roles.guard';
@Controller('departments')

export class DepartmentsController {
    prisma: any;
    constructor(private readonly departmentService: DepartmentService) { }

    @HttpCode(HttpStatus.OK) // task4

    @Post("Add")
    async createDepartment(@Body() departmentData: Departments) {
        return this.departmentService.createDepartment(departmentData);
    }
    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) {
        const formattedId = parseInt(id, 10);
        return this.departmentService.deleteDepartment(formattedId);
    }

    @Patch(':id')
    async updateAppointment(@Body() departmentData: Departments) {
        return this.departmentService.updateDepartment(departmentData);
    }

}
