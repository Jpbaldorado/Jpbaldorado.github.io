import { useRef, useState } from 'react';
import { skillClusters } from '../../data/portfolio';

/** ARIA tabs with roving focus: arrows move selection, Home/End jump to the ends. */
export default function SkillMatrix() {
  const [active, setActive] = useState(skillClusters[0].id);
  const tabRefs = useRef({});

  const select = (id) => {
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  const onKeyDown = (event) => {
    const index = skillClusters.findIndex((cluster) => cluster.id === active);
    const keys = {
      ArrowRight: (index + 1) % skillClusters.length,
      ArrowLeft: (index - 1 + skillClusters.length) % skillClusters.length,
      Home: 0,
      End: skillClusters.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(skillClusters[keys[event.key]].id);
  };

  const cluster = skillClusters.find((item) => item.id === active);

  return (
    <section id="skills" className="shell scroll-mt-24 py-16">
      <p className="rail-label uppercase">04 / Skills</p>
      <h2 className="mt-2 text-headline font-bold text-ink">Technical matrix</h2>

      <div
        role="tablist"
        aria-label="Skill clusters"
        onKeyDown={onKeyDown}
        className="mt-8 flex flex-wrap gap-2 border-b border-frame"
      >
        {skillClusters.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.id)}
              className={`-mb-px border-b-2 px-4 py-2.5 font-mono text-data transition-colors ${
                selected
                  ? 'border-accent text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${cluster.id}`}
        aria-labelledby={`tab-${cluster.id}`}
        tabIndex={0}
        className="panel mt-6 p-6 sm:p-8"
      >
        <p className="max-w-prose text-muted">{cluster.summary}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cluster.skills.map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-3 rounded-port border border-frame px-3 py-2 font-mono text-data text-ink"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-port bg-accent-ink" />
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
