export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Optional companion shown to the right of the text on desktop (text ~58%, aside ~42%). */
  aside?: React.ReactNode;
}) {
  return (
    <section className={`wrap pb-12 pt-14 md:pb-20 md:pt-24 ${aside ? "grid items-center gap-x-12 gap-y-8 lg:grid-cols-12" : ""}`}>
      <div className={aside ? "lg:col-span-7" : undefined}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-[18ch] text-[2.9rem] leading-[1] sm:text-6xl md:text-7xl">{title}</h1>
        {children && <div className="mt-6 max-w-prose text-[1.15rem] text-ink/75">{children}</div>}
      </div>
      {aside && <div className="lg:col-span-5">{aside}</div>}
    </section>
  );
}
