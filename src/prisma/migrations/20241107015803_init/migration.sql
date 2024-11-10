/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Consumer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Consumer_cpf_key" ON "Consumer"("cpf");
