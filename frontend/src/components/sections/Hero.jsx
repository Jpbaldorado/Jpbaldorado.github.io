import { cvUrl } from '../../lib/api';
import { profile } from '../../data/portfolio';

export default function Hero() {
  return (
    <section id="hero" className="shell pb-16 pt-20 sm:pt-28">
      <p className="rail-label mb-6 flex items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 animate-link rounded-port bg-signal" />
        Available — {profile.location}
      </p>

      <h1 className="max-w-prose text-display font-bold text-ink">{profile.name}</h1>

      <p className="mt-5 max-w-prose font-mono text-data text-accent-ink">{profile.role}</p>

      <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">{profile.valueProp}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="#contact"
          className="rounded-panel bg-accent px-5 py-2.5 font-mono text-data font-medium text-white transition-colors hover:bg-accent-ink"
        >
          Start a conversation
        </a>
        <a
          href={cvUrl}
          className="rounded-panel border border-frame px-5 py-2.5 font-mono text-data text-ink transition-colors hover:border-accent"
        >
          Download CV
        </a>
      </div>
    </section>
  );
}
