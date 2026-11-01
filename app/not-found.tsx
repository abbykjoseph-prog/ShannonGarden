import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl sm:text-6xl">This bed hasn&apos;t been planted yet.</h1>
      <p className="mt-4 text-ink/70">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary mt-8">Back to the garden</Link>
    </section>
  );
}
