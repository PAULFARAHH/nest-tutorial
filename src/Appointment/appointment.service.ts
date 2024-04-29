import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointments, Status } from '@prisma/client'; // Import the Doctor type from Prisma
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AppointmentService {

  constructor(private readonly prisma: PrismaService) { }

  async scheduleAppointment(appointmentData: Appointments): Promise<Appointments> {
    try {
      // Convert appointment_date and end_time to Date objects
      const appointmentDate = appointmentData.appointment_date;
      const endTime = appointmentData.end_time;

      // Check condition 1: Verify that the doctor assigned to the appointment is already assigned to the patient
      const assignedDoctor = await this.prisma.patients.findFirst({
        where: {
          patient_id: appointmentData.patient_id,
          doctor_id: appointmentData.doctor_id
        }
      });

      if (!assignedDoctor) {
        throw new Error('The specified doctor is not assigned to the patient');
      }

      // Check condition 2: Ensure that appointment_date is before end_time
      if (appointmentDate >= endTime) {
        throw new Error('Appointment start time must be before end time');
      }

      // Check condition 3: Ensure that the new appointment does not overlap with existing appointments
      const existingAppointments = await this.prisma.appointments.findMany({
        where: {
          OR: [
            {
              AND: [
                { appointment_date: { lt: endTime } },
                { end_time: { gt: appointmentDate } },
                { doctor_id: appointmentData.doctor_id }
              ]
            },
            {
              AND: [
                { appointment_date: { lt: endTime } },
                { end_time: { gt: appointmentDate } },
                { patient_id: appointmentData.patient_id }
              ]
            }
          ]
        }
      });

      if (existingAppointments.length > 0) {
        throw new Error('Appointment overlaps with existing appointment');
      }

      // If all conditions pass, create the new appointment





      return this.prisma.appointments.create({
        data: {
          doctor_id: appointmentData.doctor_id,
          patient_id: appointmentData.patient_id,
          status: appointmentData.status,
          appointment_date: appointmentData.appointment_date,
          end_time: appointmentData.end_time,
        }
      });
    } catch (error) {
      // Handle errors
      console.error('Error scheduling appointment:', error);

      // Return custom error object with error type and condition
      if (error.message === 'The specified doctor is not assigned to the patient') {
        throw { type: 'DoctorNotAssignedError', condition: 'Condition 1' };
      } else if (error.message === 'Appointment start time must be before end time') {
        throw { type: 'InvalidAppointmentTimeError', condition: 'Condition 2' };
      } else if (error.message === 'Appointment overlaps with existing appointment') {
        throw { type: 'AppointmentOverlapError', condition: 'Condition 3' };
      } else {
        throw { type: 'UnknownError', condition: 'Unknown' };
      }
    }
  }
  async getAppointmentsByPatientIdAndDateRange(Id: number, PorD: string, startDate: string, endDate: string) {
    try {
      const commonConditions = {
        OR: [
          {
            appointment_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            end_time: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            appointment_date: {
              lt: startDate,
            },
            end_time: {
              gt: endDate,
            },
          },
        ],
      };

      let appointments;
      if (PorD === "patient") {
        appointments = await this.prisma.appointments.findMany({
          where: {
            patient_id: Id,
            ...commonConditions,
          },
        });
      } if (PorD === "doctor") {
        appointments = await this.prisma.appointments.findMany({
          where: {
            doctor_id: Id,
            ...commonConditions,
          },
        });
      }

      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      throw new Error('Failed to fetch appointments');
    }
  }



  // spaacceeee
  //     throw new Error('Error scheduling appointment');
  //   }
  // }
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

  // patient
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
  async getAllPatientsAndDoctors(page: number, perPage: string) {
    const limit = parseInt(perPage, 10);
    const skip = (page - 1) * limit; // Calculate skip offset for pagination

    // Retrieve patients
    const patients = await this.prisma.patients.findMany({
      take: limit,
      skip: skip,
      include: {
        doctor: true, // Assuming the name of the relation is 'doctor'
      },
    });



    return { patients };
  }
  //doctor
  async approveAppointment(doctorId: number, appointmentId: number) {
    // Check if the doctor exists
    const doctor = await this.prisma.doctors.findUnique({
      where: {
        doctor_id: doctorId // Use the doctorId parameter directly
      }
    });

    // Check if the appointment associated with the doctor exists
    const appointment = await this.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    }

    // Update the status of the appointment to approved
    return this.changeAppointmentStatus(appointmentId, Status.approved);
  }

  async rejectAppointment(doctorId: number, appointmentId: number) {
    // Check if the doctor exists
    const doctor = await this.prisma.doctors.findUnique({ where: { doctor_id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${doctorId} not found`);
    }

    // Check if the appointment associated with the doctor exists
    const appointment = await this.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    }

    // Update the status of the appointment to cancelled
    return this.changeAppointmentStatus(appointmentId, Status.cancelled);
  }





}

