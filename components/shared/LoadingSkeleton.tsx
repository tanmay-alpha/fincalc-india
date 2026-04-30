export default function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="mb-3 h-8 w-64 rounded-lg bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card space-y-8 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 rounded bg-muted-foreground/15" />
                  <div className="h-6 w-16 rounded-lg bg-primary/10" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted-foreground/15" />
              </div>
            ))}
          </div>
          <div className="h-28 rounded-2xl bg-primary/10" />
          <div className="surface-card space-y-4 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-28 rounded bg-muted-foreground/15" />
                <div className="h-4 w-20 rounded bg-muted-foreground/15" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="surface-card h-96 p-6" />
        </div>
      </div>
    </div>
  );
}
