/*
  Warnings:

  - You are about to drop the column `jobUrl` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "jobUrl",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "jobLink" TEXT,
ADD COLUMN     "location" TEXT;
