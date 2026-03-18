-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "ProgramDocumentType" AS ENUM ('curriculum', 'opop', 'regulation', 'brochure', 'other');

-- AlterTable
ALTER TABLE "Direction" ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "heroDescription" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT[],
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "status" "ProgramStatus" NOT NULL DEFAULT 'published',
ADD COLUMN     "studyForm" TEXT,
ALTER COLUMN "careerPaths" DROP DEFAULT,
ALTER COLUMN "keyDifferences" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DirectionSubject" ADD COLUMN     "blockId" TEXT,
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "subjectId" TEXT;

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "websiteUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "defaultInfoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerRole" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionAdmissionStat" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "budgetPlaces" INTEGER,
    "paidPlaces" INTEGER,
    "tuitionPerYearRub" INTEGER,
    "passingScoreBudget" DECIMAL(4,2),
    "passingScorePaid" DECIMAL(4,2),
    "comment" TEXT,

    CONSTRAINT "DirectionAdmissionStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionDocument" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "type" "ProgramDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "versionLabel" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DirectionDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionSection" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DirectionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionSectionItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "DirectionSectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionCareerRole" (
    "id" TEXT NOT NULL,
    "directionId" TEXT NOT NULL,
    "careerRoleId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "comment" TEXT,

    CONSTRAINT "DirectionCareerRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectBlock_name_key" ON "SubjectBlock"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectBlock_slug_key" ON "SubjectBlock"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_key" ON "Subject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareerRole_title_key" ON "CareerRole"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CareerRole_slug_key" ON "CareerRole"("slug");

-- CreateIndex
CREATE INDEX "DirectionAdmissionStat_directionId_year_idx" ON "DirectionAdmissionStat"("directionId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "DirectionAdmissionStat_directionId_year_key" ON "DirectionAdmissionStat"("directionId", "year");

-- CreateIndex
CREATE INDEX "DirectionDocument_directionId_type_idx" ON "DirectionDocument"("directionId", "type");

-- CreateIndex
CREATE INDEX "DirectionSection_directionId_sortOrder_idx" ON "DirectionSection"("directionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DirectionSection_directionId_sectionKey_key" ON "DirectionSection"("directionId", "sectionKey");

-- CreateIndex
CREATE INDEX "DirectionSectionItem_sectionId_sortOrder_idx" ON "DirectionSectionItem"("sectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "DirectionCareerRole_directionId_sortOrder_idx" ON "DirectionCareerRole"("directionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DirectionCareerRole_directionId_careerRoleId_key" ON "DirectionCareerRole"("directionId", "careerRoleId");

-- CreateIndex
CREATE INDEX "Direction_isPublished_sortOrder_idx" ON "Direction"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "Direction_departmentId_idx" ON "Direction"("departmentId");

-- CreateIndex
CREATE INDEX "DirectionSubject_subjectId_idx" ON "DirectionSubject"("subjectId");

-- CreateIndex
CREATE INDEX "DirectionSubject_blockId_idx" ON "DirectionSubject"("blockId");

-- CreateIndex
CREATE INDEX "DirectionSubject_departmentId_idx" ON "DirectionSubject"("departmentId");

-- AddForeignKey
ALTER TABLE "Direction" ADD CONSTRAINT "Direction_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionAdmissionStat" ADD CONSTRAINT "DirectionAdmissionStat_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionSubject" ADD CONSTRAINT "DirectionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionSubject" ADD CONSTRAINT "DirectionSubject_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "SubjectBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionSubject" ADD CONSTRAINT "DirectionSubject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionDocument" ADD CONSTRAINT "DirectionDocument_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionSection" ADD CONSTRAINT "DirectionSection_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionSectionItem" ADD CONSTRAINT "DirectionSectionItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DirectionSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionCareerRole" ADD CONSTRAINT "DirectionCareerRole_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionCareerRole" ADD CONSTRAINT "DirectionCareerRole_careerRoleId_fkey" FOREIGN KEY ("careerRoleId") REFERENCES "CareerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
