-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('PASS', 'FAIL', 'NEEDS_REVIEW');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "middleName" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressCountry" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycCheck" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "legalAge" BOOLEAN NOT NULL,
    "countryRisk" BOOLEAN NOT NULL,
    "nameMatch" BOOLEAN NOT NULL,
    "dobMatch" BOOLEAN NOT NULL,
    "decision" "Verdict" NOT NULL,
    "motif" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "KycCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionedPerson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SanctionedPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE INDEX "KycCheck_applicantId_idx" ON "KycCheck"("applicantId");

-- CreateIndex
CREATE INDEX "SanctionedPerson_name_idx" ON "SanctionedPerson"("name");

-- AddForeignKey
ALTER TABLE "KycCheck" ADD CONSTRAINT "KycCheck_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
