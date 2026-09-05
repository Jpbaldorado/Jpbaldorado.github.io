/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Every colour is a CSS variable resolved at runtime, so a theme switch
      // repaints from one class change on <html> instead of re-running React
      // against a second set of `dark:` utilities. This is what keeps the
      // toggle flash-free.
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        frame: 'rgb(var(--c-frame) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink) / <alpha-value>)',
        signal: 'rgb(var(--c-signal) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Type scale, 1.25 ratio off a 16px base.
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
        data: ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' }],
        display: ['clamp(2.5rem, 7vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        headline: ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        metric: ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      borderRadius: { panel: '2px', port: '1px' },
      maxWidth: { prose: '68ch', shell: '1180px' },
      transitionDuration: { theme: '180ms' },
      keyframes: {
        pulseLink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: { link: 'pulseLink 2.4s ease-in-out infinite' },
    },
  },
  plugins: [],
};
