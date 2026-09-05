import { timeline } from '../../data/portfolio';

export default function Timeline() {
  return (
    <section id="experience" className="shell scroll-mt-24 py-16">
      <p className="rail-label uppercase">03 / Experience</p>
      <h2 className="mt-2 text-headline font-bold text-ink">Where the work happened</h2>

      <ol className="mt-8 border-l border-frame">
        {timeline.map((role) => (
          <li key={role.id} className="relative pb-10 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[4.5px] top-2 h-2 w-2 rounded-port ${
                role.current ? 'animate-link bg-signal' : 'bg-frame'
              }`}
            />
            <p className="font-mono text-micro uppercase text-muted">
              {role.period}
              {role.current && <span className="ml-2 text-signal">active</span>}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{role.title}</h3>
            <p className="mt-1 font-mono text-micro text-accent-ink">{role.org}</p>
            <ul className="mt-4 space-y-2">
              {role.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-frame" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
