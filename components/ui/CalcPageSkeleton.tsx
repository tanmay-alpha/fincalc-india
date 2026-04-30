export default function CalcPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-2 bg-slate-200 rounded-full" />
              <div className="h-10 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-32" />
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-64" />
        </div>
      </div>
    </div>
  );
}
