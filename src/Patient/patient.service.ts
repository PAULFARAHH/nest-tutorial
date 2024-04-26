import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointments, Patients, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatientService {
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
    async getAssignedDoctor(patientId: number): Promise<any | null> {
        const patient = await this.prisma.patients.findUnique({
            where: { patient_id: patientId },
            include: { doctor: true }, // Include the associated doctor
        });

        if (!patient) {
            throw new NotFoundException(`Patient with id ${patientId} not found`);
        }

        return patient.doctor;
    }

    async scheduleAppointment(appointmentData: Appointments) {
        try {
            // Ensure appointment_date is in ISO-8601 DateTime format
            // const formattedAppointmentDate = new Date(appointmentData.appointment_date).toISOString();

            // const appointmentTime = new Date(`1970-01-01T${appointmentData.appointment_time}`);
            // const formattedAppointmentTime = appointmentTime.toISOString().substr(11, 8);

            // Create the appointment with the correct format for appointment_date and appointment_time
            return this.prisma.appointments.create({
                data: {
                    doctor_id: appointmentData.doctor_id,
                    patient_id: appointmentData.patient_id,
                    status: appointmentData.status,
                    appointment_date: appointmentData.appointment_date, // Use formatted date here
                }
            });
        } catch (error) {
            // Handle errors
            console.error('Error scheduling appointment:', error);
            throw new Error('Error scheduling appointment');
        }
    }
    async cancelAppointment(appointmentId: number) {
        const appointment = await this.prisma.appointments.findUnique({ where: { appointment_id: appointmentId } });
        if (!appointment) {
            throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
        }
        return this.prisma.appointments.delete({ where: { appointment_id: appointmentId } });
    }

    async changeAppointmentStatus(appointmentId: number, newStatus: Status) {
        const appointment = await this.prisma.appointments.findUnique({ where: { appointment_id: appointmentId } });
        if (!appointment) {
            throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
        }
        return this.prisma.appointments.update({
            where: { appointment_id: appointmentId },
            data: { status: newStatus }
        });
    }
    async getAppointmentById(appointmentId: number): Promise<Appointments | null> {
        return this.prisma.appointments.findUnique({ where: { appointment_id: appointmentId } });
    }



    async getAllPatientsAndDoctors(page: number, perPage: string) {
        const limit = parseInt(perPage, 10);
        const skip = (page - 1) * limit; // Calculate skip offset for pagination

        // Retrieve patients
        const patients = await this.prisma.patients.findMany({
            take: limit,
            skip: skip,
        });

        // Calculate remaining limit for doctors
        const remainingLimitForDoctors = limit - patients.length;

        // Retrieve doctors with adjusted limit
        const doctors = await this.prisma.doctors.findMany({
            take: remainingLimitForDoctors,
            skip: skip,
        });

        return { patients, doctors };
    }


}
