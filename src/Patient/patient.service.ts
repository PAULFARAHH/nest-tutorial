import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointments, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { request } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointments, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatientService {
    findAll(skip: number, take: number): { patient_id: number; name: string; doctor_id: number; }[] | PromiseLike<{ patient_id: number; name: string; doctor_id: number; }[]> {
        throw new Error('Method not implemented.');
    }
    findAll(skip: number, take: number): { patient_id: number; name: string; doctor_id: number; }[] | PromiseLike<{ patient_id: number; name: string; doctor_id: number; }[]> {
        throw new Error('Method not implemented.');
    }
    constructor(private readonly prisma: PrismaService) { }

    async createPatient(patientData: Patients) { // we are obiged to put doctor_id 
        return this.prisma.patients.create({
            data: patientData,
        });
    }
    async assignDoctor(patientId: number, doctorId: number): Promise<Patients | null> {
        try {
            // Find the patient by ID
            const patient = await this.prisma.patients.findUnique({
                where: { patient_id: patientId },
            });

            if (!patient) {
                throw new Error('Patient not found');
            }

            // Update the patient's doctor_id
            const updatedPatient = await this.prisma.patients.update({
                where: { patient_id: patientId },
                data: { doctor_id: doctorId },
            });

            return updatedPatient;
        } catch (error) {
            // Handle errors
            console.error('Error assigning doctor:', error);
            throw new Error('Error assigning doctor');
        }
    }

   


    // async getAllPatientsAndDoctors(page: number, perPage: string) {

    //     const limit = parseInt(perPage, 10);
    //     const skip = (page - 1) * limit; // Calculate skip offset for pagination

    //     // Retrieve patients
    //     const patients = await this.prisma.patients.findMany({
    //         take: limit,
    //         skip: skip,
    //     });

    //     // Calculate remaining limit for doctors
    //     const remainingLimitForDoctors = limit - patients.length;

    //     // Retrieve doctors with adjusted limit
    //     const doctors = await this.prisma.doctors.findMany({
    //         take: remainingLimitForDoctors,
    //         skip: skip,
    //     });

    //     return { patients, doctors };
    // }

}
