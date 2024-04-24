import { Injectable } from '@nestjs/common';
import { Patients } from '@prisma/client'; // Import the Doctor type from Prisma
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatientService {
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
}
