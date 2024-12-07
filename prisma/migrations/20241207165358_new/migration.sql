/*
  Warnings:

  - You are about to drop the column `title` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `titles` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Posts" DROP COLUMN "title",
ADD COLUMN     "titles" TEXT NOT NULL;
