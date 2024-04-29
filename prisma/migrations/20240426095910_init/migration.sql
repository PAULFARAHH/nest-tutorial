/*
  Warnings:

  - You are about to drop the column `duration` on the `Appointments` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `Appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "duration",
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL;
