ALTER TABLE "Direction"
ADD COLUMN "code" TEXT,
ADD COLUMN "qualification" TEXT,
ADD COLUMN "department" TEXT,
ADD COLUMN "studyDuration" TEXT,
ADD COLUMN "budgetSeats" INTEGER,
ADD COLUMN "paidSeats" INTEGER,
ADD COLUMN "tuitionPerYearRub" INTEGER,
ADD COLUMN "programDescriptionUrl" TEXT,
ADD COLUMN "curriculumUrl" TEXT,
ADD COLUMN "learningContent" JSONB;

CREATE UNIQUE INDEX "Direction_code_key" ON "Direction"("code");

CREATE TABLE "DirectionPassingScore" (
  "id" TEXT NOT NULL,
  "directionId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "budget" DECIMAL(4, 2),
  "paid" DECIMAL(4, 2),

  CONSTRAINT "DirectionPassingScore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DirectionSubject" (
  "id" TEXT NOT NULL,
  "directionId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subjectBlock" TEXT,
  "department" TEXT,
  "hours" INTEGER NOT NULL,
  "referenceUrl" TEXT,
  "sortOrder" INTEGER,

  CONSTRAINT "DirectionSubject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DirectionPassingScore_directionId_year_key"
ON "DirectionPassingScore"("directionId", "year");

CREATE INDEX "DirectionPassingScore_directionId_idx"
ON "DirectionPassingScore"("directionId");

CREATE INDEX "DirectionSubject_directionId_idx"
ON "DirectionSubject"("directionId");

ALTER TABLE "DirectionPassingScore"
ADD CONSTRAINT "DirectionPassingScore_directionId_fkey"
FOREIGN KEY ("directionId") REFERENCES "Direction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DirectionSubject"
ADD CONSTRAINT "DirectionSubject_directionId_fkey"
FOREIGN KEY ("directionId") REFERENCES "Direction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
