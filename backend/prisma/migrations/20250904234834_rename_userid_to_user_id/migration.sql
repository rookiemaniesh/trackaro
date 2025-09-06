/*
  Warnings:

  - You are about to drop the column `userId` on the `ConversationState` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,type]` on the table `ConversationState` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `ConversationState` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Expense` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ConversationState" DROP CONSTRAINT "ConversationState_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropIndex
DROP INDEX "public"."ConversationState_userId_type_key";

-- DropIndex
DROP INDEX "public"."Message_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "public"."ConversationState" DROP COLUMN "userId",
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "userId",
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "userId",
ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConversationState_user_id_type_key" ON "public"."ConversationState"("user_id", "type");

-- CreateIndex
CREATE INDEX "Message_user_id_createdAt_idx" ON "public"."Message"("user_id", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationState" ADD CONSTRAINT "ConversationState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
