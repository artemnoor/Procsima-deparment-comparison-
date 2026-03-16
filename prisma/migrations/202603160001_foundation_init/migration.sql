CREATE TYPE "RoleKey" AS ENUM ('admissions_admin', 'admissions_analyst');

CREATE TYPE "EventType" AS ENUM (
  'page_opened',
  'direction_opened',
  'compare_started',
  'comparison_run',
  'recommendation_generated'
);

CREATE TABLE "Direction" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "programFocus" TEXT,
  "whatYouLearn" TEXT,
  "careerPaths" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "targetFit" TEXT,
  "keyDifferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "programmingScore" INTEGER,
  "mathScore" INTEGER,
  "engineeringScore" INTEGER,
  "analyticsScore" INTEGER,
  "aiScore" INTEGER,
  "learningDifficulty" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Direction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT,
  "name" TEXT,
  "role" "RoleKey" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "type" "EventType" NOT NULL,
  "userId" TEXT,
  "directionId" TEXT,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Direction_slug_key" ON "Direction"("slug");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

ALTER TABLE "Event"
ADD CONSTRAINT "Event_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
