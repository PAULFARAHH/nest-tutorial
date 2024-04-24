-- AlterTable
ALTER TABLE "Departments" ALTER COLUMN "department_id" DROP DEFAULT;
DROP SEQUENCE "Departments_department_id_seq";

-- CreateTable
CREATE TABLE "Doctors" (
    "doctor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "patient_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "appointment_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "appointment_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("appointment_id")
);

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patients" ADD CONSTRAINT "Patients_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctors"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctors"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
