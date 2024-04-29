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

  

  




}
