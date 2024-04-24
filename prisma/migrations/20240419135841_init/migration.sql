-- AlterTable
CREATE SEQUENCE appointments_appointment_id_seq;
ALTER TABLE "Appointments" ALTER COLUMN "appointment_id" SET DEFAULT nextval('appointments_appointment_id_seq');
ALTER SEQUENCE appointments_appointment_id_seq OWNED BY "Appointments"."appointment_id";

-- AlterTable
CREATE SEQUENCE departments_department_id_seq;
ALTER TABLE "Departments" ALTER COLUMN "department_id" SET DEFAULT nextval('departments_department_id_seq');
ALTER SEQUENCE departments_department_id_seq OWNED BY "Departments"."department_id";

-- AlterTable
CREATE SEQUENCE doctors_doctor_id_seq;
ALTER TABLE "Doctors" ALTER COLUMN "doctor_id" SET DEFAULT nextval('doctors_doctor_id_seq');
ALTER SEQUENCE doctors_doctor_id_seq OWNED BY "Doctors"."doctor_id";

-- AlterTable
CREATE SEQUENCE patients_patient_id_seq;
ALTER TABLE "Patients" ALTER COLUMN "patient_id" SET DEFAULT nextval('patients_patient_id_seq');
ALTER SEQUENCE patients_patient_id_seq OWNED BY "Patients"."patient_id";
