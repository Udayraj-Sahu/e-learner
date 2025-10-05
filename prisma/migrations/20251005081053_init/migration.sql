/*
  Warnings:

  - You are about to drop the column `youtubeVideoId` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId,index]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Made the column `videoUrl` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropIndex
DROP INDEX "public"."CourseCategory_categoryId_idx";

-- DropIndex
DROP INDEX "public"."Lesson_courseId_youtubeVideoId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "youtubeVideoId",
ALTER COLUMN "videoUrl" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_index_key" ON "Lesson"("courseId", "index");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
