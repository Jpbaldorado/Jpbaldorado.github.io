import { useCallback, useState } from 'react';
import { projects } from '../../data/portfolio';

export default function Projects() {
  const [index, setIndex] = useState(0);
  const project = projects[index];

  const step = useCallback((delta) => {
    setIndex((current) => (current + delta + projects.length) % projects.length);
  }, []);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  };

  return (
    <section id="projects" className="shell scroll-mt-24 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="rail-label uppercase">01 / Projects</p>
          <h2 className="mt-2 text-headline font-bold text-ink">Deployments and platforms</h2>
        </div>
        <p className="font-mono text-micro text-muted">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </p>
      </div>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="panel p-6 sm:p-8"
      >
        <p className="rail-label uppercase">{project.topology}</p>
        <h3 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">{project.title}</h3>
        <p className="mt-4 max-w-prose leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-port border border-frame px-2.5 py-1 font-mono text-micro text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-2 border-t border-frame pt-5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous project"
            className="rounded-panel border border-frame px-3 py-1.5 font-mono text-micro text-muted transition-colors hover:border-accent hover:text-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next project"
            className="rounded-panel border border-frame px-3 py-1.5 font-mono text-micro text-muted transition-colors hover:border-accent hover:text-ink"
          >
            →
          </button>
          <p aria-live="polite" className="sr-only">
            {project.title}, project {index + 1} of {projects.length}
          </p>
        </div>
      </div>
    </section>
  );
}
