-- CreateTable
CREATE TABLE "weekly_kpis" (
    "id" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "metaSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "googleSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metaCampaigns" JSONB,
    "upfrontReceived" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "backendReceived" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_deals" (
    "id" TEXT NOT NULL,
    "weeklyKpiId" TEXT NOT NULL,
    "leadId" TEXT,
    "customerName" TEXT NOT NULL,
    "vivintAccountIds" TEXT[],
    "product" TEXT,
    "upfrontCommission" DOUBLE PRECISION NOT NULL,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weekly_kpis_weekStart_key" ON "weekly_kpis"("weekStart");

-- CreateIndex
CREATE INDEX "weekly_kpis_weekStart_idx" ON "weekly_kpis"("weekStart");

-- CreateIndex
CREATE INDEX "weekly_deals_weeklyKpiId_idx" ON "weekly_deals"("weeklyKpiId");

-- CreateIndex
CREATE INDEX "weekly_deals_leadId_idx" ON "weekly_deals"("leadId");

-- AddForeignKey
ALTER TABLE "weekly_deals" ADD CONSTRAINT "weekly_deals_weeklyKpiId_fkey" FOREIGN KEY ("weeklyKpiId") REFERENCES "weekly_kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_deals" ADD CONSTRAINT "weekly_deals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
