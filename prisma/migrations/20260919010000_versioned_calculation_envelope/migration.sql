-- Add versioned calculation envelope and idempotency fields
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "mode" TEXT;
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "engineVersion" TEXT NOT NULL DEFAULT '1.0.0';
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "schemaVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "rulesetId" TEXT;
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "inputsHash" TEXT;
ALTER TABLE "Calculation" ADD COLUMN IF NOT EXISTS "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Calculation_inputsHash_idx" ON "Calculation"("inputsHash");
