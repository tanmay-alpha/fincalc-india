import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="mb-4 text-8xl font-extrabold text-primary/20">404</div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Page Not Found</h2>
      <p className="mb-8 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
