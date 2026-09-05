import { navLinks } from '../../data/portfolio';

/**
 * Fixed left rail of section markers with link-status LEDs that light as you scroll.
 * Hidden below 2xl: narrower than that, the rail overlaps the centred shell.
 */
export default function SectionRail({ activeSection }) {
  return (
    <nav
      aria-label="Section rail"
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
    >
      <ul className="flex flex-col gap-4">
        {navLinks.map((link, index) => {
          const active = activeSection === link.id;
          return (
            <li key={link.id}>
              <a href={`#${link.id}`} className="group flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-port border transition-colors ${
                    active
                      ? 'animate-link border-signal bg-signal'
                      : 'border-frame bg-transparent group-hover:border-accent'
                  }`}
                />
                <span
                  className={`rail-label transition-colors ${active ? 'text-ink' : 'group-hover:text-ink'}`}
                >
                  {String(index + 1).padStart(2, '0')} {link.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
