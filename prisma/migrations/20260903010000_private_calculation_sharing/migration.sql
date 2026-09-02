-- Saved calculations are private unless an owner explicitly publishes them.
ALTER TABLE "Calculation" ADD COLUMN "isShared" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Calculation" ALTER COLUMN "shareId" DROP NOT NULL;
ALTER TABLE "Calculation" ALTER COLUMN "shareId" DROP DEFAULT;
