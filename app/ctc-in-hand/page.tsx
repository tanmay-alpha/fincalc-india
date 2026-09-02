import Breadcrumb from "@/components/ui/Breadcrumb";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import CTCCalculator from "@/components/calculators/ctc/CTCCalculator";
export default function CtcInHandPage() { return <main id="main-content" className="min-h-screen bg-background pb-24"><div className="mx-auto max-w-7xl px-4 py-8"><Breadcrumb items={[{label:"Home",href:"/"},{label:"CTC to In-Hand"}]} /><h1 className="mt-4 text-3xl font-bold">CTC to In-Hand Salary Calculator</h1><p className="mt-2 text-sm text-muted-foreground">Estimate cash salary, PF, gratuity, HRA treatment and income-tax deductions.</p><CTCCalculator /><CalculatorDisclaimer /></div></main>; }
