import { Injectable } from '@nestjs/common';
import { Doctors } from '@prisma/client'; // Import the Doctor type from Prisma
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) { }

  async createDoctor(doctorData: Doctors) { // we are obliged to put doctor_id 
    return this.prisma.doctors.create({
      data: doctorData,
    });
  }

}
