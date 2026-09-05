import { useTheme } from '../../context/ThemeContext';
import { navLinks, profile } from '../../data/portfolio';

export default function Navbar({ activeSection }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-frame bg-canvas/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a href="#main" className="font-mono text-data font-medium text-ink">
          {profile.brand}
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeSection === link.id ? 'true' : undefined}
                  className={`link-underline font-mono text-micro uppercase tracking-wide transition-colors ${
                    activeSection === link.id ? 'text-accent-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="rounded-panel border border-frame px-3 py-1.5 font-mono text-micro uppercase text-muted transition-colors hover:border-accent hover:text-ink"
        >
          {isDark ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}
