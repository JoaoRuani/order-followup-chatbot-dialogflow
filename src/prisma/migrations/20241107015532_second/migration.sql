/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Consumer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN "cancellation_reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_cpf_key" ON "Consumer"("cpf");
