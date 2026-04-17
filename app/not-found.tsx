import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-8xl font-extrabold text-primary/20 dark:text-primary/10 mb-4">404</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
