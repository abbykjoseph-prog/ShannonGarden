import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-24 md:py-32">
      <Image src="/monogram.png" alt="" width={600} height={600} className="h-20 w-auto" />
      <h1 className="mt-8 max-w-[16ch] text-5xl leading-[1.02] sm:text-6xl">This bed hasn&apos;t been planted yet.</h1>
      <p className="mt-4 text-ink/70">There&apos;s no page at this address.</p>
      <Link href="/" className="btn-primary mt-8">Back to the home page</Link>
    </section>
  );
}
