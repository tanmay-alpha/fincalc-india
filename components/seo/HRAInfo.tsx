export default function HRAInfo() {
  return (
    <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          How HRA Tax Exemption Works (Section 10(13A) & Rule 2A)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          House Rent Allowance (HRA) is paid by employers to help salaried individuals meet accommodation costs. Under Section 10(13A) read with Rule 2A of the Income Tax Rules, the exemption from income tax is calculated as the <strong>lowest</strong> of the following three statutory amounts:
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">1. Actual HRA Received</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The full allowance amount received from your employer under the HRA head for the period of rented accommodation.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">2. Rent Paid Minus 10% Salary</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Actual rent paid minus 10% of salary base (Basic + DA if forming part of retirement benefits + commission if fixed percentage of turnover).
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">3. 50% or 40% of Salary</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <strong>50%</strong> of basic salary if living in Metro cities (Delhi, Mumbai, Kolkata, Chennai) or <strong>40%</strong> for all other cities in India.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Paying Rent to Parents: Rules and Compliance Checklist
        </h2>
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <p className="font-medium text-blue-900 dark:text-blue-200">
            You can legitimately claim HRA exemption by paying rent to your parents if:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
            <li><strong>Property Ownership:</strong> The residential property must be legally owned by your parents (not by you or co-owned by you).</li>
            <li><strong>Formal Agreement:</strong> A written, registered or notarized rent agreement is maintained specifying the rent amount and property address.</li>
            <li><strong>Bank Paper Trail:</strong> Rent is transferred periodically via online banking or cheque to the parent&apos;s bank account.</li>
            <li><strong>ITR Disclosure:</strong> Parents must report the rental income in their personal Income Tax Return (ITR) under &ldquo;Income from House Property&rdquo;. They are entitled to a standard 30% deduction under Section 24(a) plus deduction for municipal taxes paid.</li>
            <li><strong>PAN Submission:</strong> If annual rent exceeds ₹1,00,000, the landlord&apos;s (parent&apos;s) PAN must be submitted to your employer.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
