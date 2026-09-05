const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class FieldError extends Error {
  constructor(fields, message) {
    super(message);
    this.fields = fields;
  }
}

/** Maps FastAPI's 422 payload back onto individual form fields. */
function fieldsFromValidationError(detail) {
  const fields = {};
  if (!Array.isArray(detail)) return fields;
  for (const item of detail) {
    const name = item.loc?.[item.loc.length - 1];
    if (typeof name === 'string' && !fields[name]) fields[name] = item.msg;
  }
  return fields;
}

export async function submitContact(payload) {
  const response = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 422) {
    const body = await response.json();
    throw new FieldError(fieldsFromValidationError(body.detail), 'Check the highlighted fields.');
  }

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('Retry-After') ?? 0);
    const minutes = Math.max(1, Math.ceil(retryAfter / 60));
    throw new FieldError({}, `Too many messages from this address. Try again in ~${minutes} min.`);
  }

  if (!response.ok) {
    throw new FieldError({}, 'Something failed on the server. Try again shortly.');
  }

  return response.json();
}

export const cvUrl = `${BASE}/api/cv`;

/**
 * Whether a live API is reachable.
 *
 * In development the Vite proxy forwards /api to the local backend. In a
 * production build there is only a backend if VITE_API_BASE_URL was set at
 * build time. On a static host (GitHub Pages) it is not, so the contact form
 * falls back to composing a mailto: instead of POSTing into a void.
 */
export const hasApiBackend = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_BASE_URL);
