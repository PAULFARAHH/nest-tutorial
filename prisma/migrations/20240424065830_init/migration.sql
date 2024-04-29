-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'completed', 'cancelled', 'approved');

-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
