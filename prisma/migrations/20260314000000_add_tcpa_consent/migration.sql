-- AlterTable
ALTER TABLE "leads" ADD COLUMN "tcpaConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "leads" ADD COLUMN "tcpaConsentAt" TIMESTAMP(3);
