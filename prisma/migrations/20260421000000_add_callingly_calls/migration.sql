-- AlterTable
ALTER TABLE "leads" ADD COLUMN "callinglyLeadId" TEXT;
ALTER TABLE "leads" ADD COLUMN "assignedAgent" TEXT;
ALTER TABLE "leads" ADD COLUMN "latestCallStatus" TEXT;
ALTER TABLE "leads" ADD COLUMN "latestCallRecordingUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "leads_callinglyLeadId_key" ON "leads"("callinglyLeadId");

-- CreateTable
CREATE TABLE "calls" (
    "id" TEXT NOT NULL,
    "callinglyId" TEXT NOT NULL,
    "leadId" TEXT,
    "phone" TEXT NOT NULL,
    "status" TEXT,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "agentId" TEXT,
    "agentName" TEXT,
    "result" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calls_callinglyId_key" ON "calls"("callinglyId");
CREATE INDEX "calls_leadId_idx" ON "calls"("leadId");
CREATE INDEX "calls_phone_idx" ON "calls"("phone");
CREATE INDEX "calls_startedAt_idx" ON "calls"("startedAt");
CREATE INDEX "calls_agentId_idx" ON "calls"("agentId");

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
