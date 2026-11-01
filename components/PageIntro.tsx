export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="wrap pb-12 pt-14 md:pb-20 md:pt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-[18ch] text-[2.9rem] leading-[1] sm:text-6xl md:text-7xl">{title}</h1>
      {children && <div className="mt-6 max-w-prose text-[1.15rem] text-ink/75">{children}</div>}
    </section>
  );
}
