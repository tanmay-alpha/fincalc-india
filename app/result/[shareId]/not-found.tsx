import Link from "next/link";

export default function ResultNotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-sm w-full">
        <div className="text-7xl font-bold text-slate-200 dark:text-slate-800 mb-2">
          404
        </div>
        <div className="text-3xl mb-4">🔍</div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Calculation not found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          This shared calculation has been revoked by the owner or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition"
        >
          Create your own calculation →
        </Link>
      </div>
    </main>
  );
}
