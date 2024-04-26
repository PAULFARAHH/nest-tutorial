import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointments, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentService {



  constructor(private readonly prisma: PrismaService) { }

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

}

