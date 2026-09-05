import { achievements, certifications } from '../../data/portfolio';

export default function Achievements() {
  return (
    <section id="achievements" className="shell scroll-mt-24 py-16">
      <p className="rail-label uppercase">02 / Achievements</p>
      <h2 className="mt-2 text-headline font-bold text-ink">Recognition and credentials</h2>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {achievements.map((item) => (
          <li key={item.id} className="panel p-6">
            <p className="rail-label uppercase">{item.kind}</p>
            <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-1 font-mono text-micro text-accent-ink">{item.org}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-12 font-mono text-data uppercase text-muted">Certifications</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {certifications.map((cert) => (
          <li key={cert.id} className="panel flex items-start gap-3 p-5">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-port ${cert.verified ? 'bg-signal' : 'bg-frame'}`}
            />
            <div>
              <p className="text-sm font-medium text-ink">{cert.name}</p>
              <p className="mt-1 font-mono text-micro text-muted">{cert.issuer}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
