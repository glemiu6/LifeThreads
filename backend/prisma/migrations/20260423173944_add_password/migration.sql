-- AlterEnum
ALTER TYPE "Reaction" ADD VALUE 'FOLLOW';

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;
