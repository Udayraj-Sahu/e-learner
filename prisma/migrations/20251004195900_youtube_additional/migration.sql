/*
  Warnings:

  - A unique constraint covering the columns `[youtubePlaylistId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,youtubeVideoId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CourseSource" AS ENUM ('ADMIN', 'YOUTUBE');

-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropIndex
DROP INDEX "public"."Lesson_courseId_idx";

-- DropIndex
DROP INDEX "public"."Lesson_courseId_index_key";

-- DropIndex
DROP INDEX "public"."UserProfile_email_key";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "channelTitle" TEXT,
ADD COLUMN     "source" "CourseSource" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "youtubePlaylistId" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "youtubeVideoId" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_youtubePlaylistId_key" ON "Course"("youtubePlaylistId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_youtubeVideoId_key" ON "Lesson"("courseId", "youtubeVideoId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
