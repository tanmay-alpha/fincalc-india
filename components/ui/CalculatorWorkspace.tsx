"use client";

import { ReactNode } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { RegulatoryMetadata } from "@/lib/calculator-contracts";
import { cn } from "@/lib/utils";

interface CalculatorWorkspaceProps {
  calcId: string;
  calcName: string;
  categoryName?: string;
  categoryRoute?: string;
  description: string;
  badge?: string;
  regulatoryMetadata?: RegulatoryMetadata;
  assumptions?: string[];
  sources?: Array<{ label: string; url: string }>;
  inputsContent: ReactNode;
  resultsContent: ReactNode;
  actionsContent?: ReactNode;
  seoContent?: ReactNode;
  className?: string;
}

export default function CalculatorWorkspace({
  calcId,
  calcName,
  categoryName,
  categoryRoute,
  description,
  badge,
  regulatoryMetadata,
  assumptions,
  sources,
  inputsContent,
  resultsContent,
  actionsContent,
  seoContent,
  className,
}: CalculatorWorkspaceProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(categoryName && categoryRoute
      ? [{ label: categoryName, href: categoryRoute }]
      : []),
    { label: calcName, href: `/${calcId}` },
  ];

  return (
    <div className={cn("min-h-screen pb-24 lg:pb-16", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Calculator Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {calcName}
                </h1>
                {badge && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {badge}
                  </span>
                )}
                {regulatoryMetadata?.taxYear && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Tax Year {regulatoryMetadata.taxYear}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground max-w-3xl">
                {description}
              </p>
            </div>

            {/* Assumptions and Statutory Sources Trigger */}
            <AssumptionsDrawer
              calcName={calcName}
              metadata={regulatoryMetadata}
              assumptions={assumptions}
              sources={sources}
            />
          </div>
        </div>

        {/* Workspace Layout: 2-Column (~42% Inputs / 58% Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs / Controls (~42%) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Parameters & Assumptions
              </h2>
              <div className="space-y-5">{inputsContent}</div>
            </div>

            {/* Calculator Action Buttons (Save / Share) */}
            {actionsContent && (
              <div className="flex items-center gap-3 pt-1">
                {actionsContent}
              </div>
            )}
          </div>

          {/* Right Column: Results, Breakdowns & Charts (~58%) */}
          <div
            className="lg:col-span-7 space-y-6 lg:sticky lg:top-20"
            data-result-hero
          >
            {resultsContent}
          </div>
        </div>

        {/* SEO & Educational Content Section (Clearly separated from Interactive Tool) */}
        {seoContent && (
          <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Financial Guidance
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Understanding {calcName}
              </h2>
            </div>
            {seoContent}
          </section>
        )}
      </div>
    </div>
  );
}
