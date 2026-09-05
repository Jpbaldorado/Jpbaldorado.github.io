import { profile } from '../../data/portfolio';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-frame py-10">
      <div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-micro text-muted">
          © {new Date().getFullYear()} {profile.name} — {profile.location}
        </p>
        <ul className="flex gap-5">
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline font-mono text-micro uppercase text-muted hover:text-ink"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline font-mono text-micro uppercase text-muted hover:text-ink"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline font-mono text-micro uppercase text-muted hover:text-ink"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
