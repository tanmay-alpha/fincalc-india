import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import { getCalculatorById, CATEGORY_MAP, CalculatorCategory } from "@/lib/registry";
import { getCategoryIcon } from "@/components/ui/CategoryIcon";
import { RegulatoryMetadata } from "@/lib/calculator-contracts";

interface CalculatorPageShellProps {
  id: string;
  title?: string;
  badge?: string;
  description?: string;
  category?: CalculatorCategory;
  assumptions?: string[];
  sources?: Array<{ label: string; url: string }>;
  regulatoryMetadata?: RegulatoryMetadata;
  children: React.ReactNode;
  educationalContent?: React.ReactNode;
}

export default function CalculatorPageShell({
  id,
  title,
  badge,
  description,
  category,
  assumptions,
  sources,
  regulatoryMetadata,
  children,
  educationalContent,
}: CalculatorPageShellProps) {
  const meta = getCalculatorById(id);
  const displayTitle = title || meta?.name || "Financial Calculator";
  const displayBadge = badge || meta?.badge;
  const displayDescription = description || meta?.description;
  const displayCategory = category || meta?.category || "investments";
  const categoryLabel = CATEGORY_MAP[displayCategory]?.label || "Calculators";
  const Icon = getCategoryIcon(id);

  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: categoryLabel, href: "/#calculators" },
            { label: displayTitle },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {displayTitle}
                </h1>
                {displayBadge && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {displayBadge}
                  </span>
                )}
              </div>
              {displayDescription && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {displayDescription}
                </p>
              )}
            </div>

            {/* Assumptions & Sources Drawer */}
            <AssumptionsDrawer
              calcName={displayTitle}
              metadata={regulatoryMetadata}
              assumptions={assumptions}
              sources={sources}
            />
          </div>
        </div>

        {/* Interactive Calculator Workspace */}
        <div className="calculator-workspace">
          {children}
        </div>

        {/* Optional Rich Educational Content */}
        {educationalContent && (
          <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto" aria-label="Educational Guide">
            {educationalContent}
          </section>
        )}

        {/* Standard Disclaimer & Related Graph */}
        <CalculatorDisclaimer />
        <RelatedCalculators current={id} />
      </div>
    </main>
  );
}
