export default function CalcPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-48 rounded-lg bg-muted" />
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <div className="surface-card space-y-6 p-6">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 rounded bg-muted-foreground/15" />
              <div className="h-2 rounded-full bg-muted-foreground/15" />
              <div className="h-10 rounded-lg bg-muted-foreground/15" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="surface-card h-32 p-6" />
          <div className="surface-card h-64 p-6" />
        </div>
      </div>
    </div>
  );
}
