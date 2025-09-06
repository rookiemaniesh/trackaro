/*
  Warnings:

  - You are about to drop the column `companion` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "companion",
ADD COLUMN     "companions" TEXT[];
