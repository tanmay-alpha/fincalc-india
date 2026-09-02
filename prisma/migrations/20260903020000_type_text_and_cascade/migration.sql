-- Convert Calculation.type from CalcType enum to TEXT
ALTER TABLE "Calculation" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;

-- Drop CalcType enum if no longer used
DROP TYPE IF EXISTS "CalcType";

-- Ensure Calculation_userId_fkey is ON DELETE CASCADE
ALTER TABLE "Calculation" DROP CONSTRAINT IF EXISTS "Calculation_userId_fkey";
ALTER TABLE "Calculation" ADD CONSTRAINT "Calculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index on createdAt if not exists
CREATE INDEX IF NOT EXISTS "Calculation_createdAt_idx" ON "Calculation"("createdAt");
