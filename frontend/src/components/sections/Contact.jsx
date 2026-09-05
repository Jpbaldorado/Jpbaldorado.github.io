import { useState } from 'react';
import { FieldError, hasApiBackend, submitContact } from '../../lib/api';
import { profile } from '../../data/portfolio';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

// Mirrors the Pydantic rules on the server, so the two agree before a round trip.
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your name.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.subject.trim().length < 3) errors.subject = 'Add a short subject.';
  if (values.message.trim().length < 10) errors.message = 'Tell me a little more (10 characters minimum).';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ state: 'error', message: 'Check the highlighted fields.' });
      return;
    }

    // Static host, no API: hand the message to the visitor's mail client rather
    // than POSTing at an endpoint that isn't there.
    if (!hasApiBackend) {
      const body = `${values.message}\n\n— ${values.name} <${values.email}>`;
      window.location.href =
        `mailto:${profile.email}` +
        `?subject=${encodeURIComponent(values.subject)}` +
        `&body=${encodeURIComponent(body)}`;
      setStatus({ state: 'sent', message: 'Opening your email client…' });
      return;
    }

    setStatus({ state: 'sending', message: '' });
    try {
      const result = await submitContact(values);
      setValues(EMPTY);
      setStatus({ state: 'sent', message: `Message received. Reference ${result.reference}.` });
    } catch (error) {
      if (error instanceof FieldError) setErrors(error.fields);
      setStatus({ state: 'error', message: error.message });
    }
  };

  const field = (name, label, type = 'text') => (
    <div>
      <label htmlFor={name} className="rail-label uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="mt-2 w-full rounded-port border border-frame bg-raised px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
      />
      {errors[name] && (
        <p id={`${name}-error`} className="mt-1.5 font-mono text-micro text-accent-ink">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="shell scroll-mt-24 py-16">
      <p className="rail-label uppercase">05 / Contact</p>
      <h2 className="mt-2 text-headline font-bold text-ink">Start a conversation</h2>
      <p className="mt-4 max-w-prose text-muted">
        For roles, deployments, or infrastructure work — send a note here, or reach me directly at{' '}
        <a href={`mailto:${profile.email}`} className="link-underline text-accent-ink">
          {profile.email}
        </a>
        .
      </p>

      <form onSubmit={onSubmit} noValidate className="panel mt-8 grid gap-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {field('name', 'Name')}
          {field('email', 'Email', 'email')}
        </div>
        {field('subject', 'Subject')}

        <div>
          <label htmlFor="message" className="rail-label uppercase">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={update('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className="mt-2 w-full rounded-port border border-frame bg-raised px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 font-mono text-micro text-accent-ink">
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={update('website')}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status.state === 'sending'}
            className="rounded-panel bg-accent px-5 py-2.5 font-mono text-data font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60"
          >
            {status.state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status.message && (
            <p
              role="status"
              className={`font-mono text-micro ${status.state === 'sent' ? 'text-signal' : 'text-accent-ink'}`}
            >
              {status.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
