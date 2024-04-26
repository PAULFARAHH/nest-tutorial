import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Doctors, Status } from '@prisma/client';
import { AppointmentService } from '../Appointment/appointment.service';
import { Appointments } from '@prisma/client'; // Import the Appointment type from Prisma

@Injectable()
export class DoctorService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentService: AppointmentService,
  ) { }
  async createDoctor(doctorData: Doctors) { // we are obliged to put doctor_id 
    return this.prisma.doctors.create({
      data: doctorData,
    });
  }
  async approveAppointment(doctorId: number, appointmentId: number) {
    // Check if the doctor exists
    const doctor = await this.prisma.doctors.findUnique({
      where: {
        doctor_id: doctorId // Use the doctorId parameter directly
      }
    });

    // Check if the appointment associated with the doctor exists
    const appointment = await this.appointmentService.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    }

    // Update the status of the appointment to approved
    return this.appointmentService.changeAppointmentStatus(appointmentId, Status.approved);
  }

  async rejectAppointment(doctorId: number, appointmentId: number) {
    // Check if the doctor exists
    const doctor = await this.prisma.doctors.findUnique({ where: { doctor_id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${doctorId} not found`);
    }

    // Check if the appointment associated with the doctor exists
    const appointment = await this.appointmentService.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    }

    // Update the status of the appointment to cancelled
    return this.appointmentService.changeAppointmentStatus(appointmentId, Status.cancelled);
  }
  async getAppointmentsForDoctor(doctorId: number): Promise<Appointments[]> {
    // Query appointments associated with the given doctorId
    console.log(doctorId);

    let a = this.prisma.appointments.findMany({
      where: {
        doctor_id: doctorId,
      },
    });
    console.log(a);
    return a;
  }

}
