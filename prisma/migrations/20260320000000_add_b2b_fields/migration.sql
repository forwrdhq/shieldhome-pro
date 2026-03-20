-- AlterTable: Add B2B fields to leads table
ALTER TABLE "leads" ADD COLUMN "leadType" TEXT NOT NULL DEFAULT 'RESIDENTIAL';
ALTER TABLE "leads" ADD COLUMN "businessName" TEXT;
ALTER TABLE "leads" ADD COLUMN "businessType" TEXT;
ALTER TABLE "leads" ADD COLUMN "numberOfLocations" TEXT;
ALTER TABLE "leads" ADD COLUMN "currentProvider" TEXT;
ALTER TABLE "leads" ADD COLUMN "biggestConcern" TEXT;
ALTER TABLE "leads" ADD COLUMN "b2bPipelineStage" TEXT;
ALTER TABLE "leads" ADD COLUMN "estimatedDealValue" DOUBLE PRECISION;
ALTER TABLE "leads" ADD COLUMN "qualificationScore" INTEGER;
ALTER TABLE "leads" ADD COLUMN "assessmentDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "leads_leadType_idx" ON "leads"("leadType");
