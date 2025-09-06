-- AlterTable
ALTER TABLE "public"."ConversationState" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Expense" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "user_id" TEXT;
