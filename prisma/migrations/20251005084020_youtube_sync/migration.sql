/*
  Warnings:

  - A unique constraint covering the columns `[courseId,youtubeVideoId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "youtubeVideoId" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_youtubeVideoId_key" ON "Lesson"("courseId", "youtubeVideoId");
