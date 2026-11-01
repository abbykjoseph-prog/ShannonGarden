export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="wrap pb-12 pt-16 md:pb-16 md:pt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-lg text-ink/75">{children}</div>}
    </section>
  );
}
