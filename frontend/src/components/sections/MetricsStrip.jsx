import { metrics } from '../../data/portfolio';

/** One rack unit: a teal top rail and three bays, not three floating cards. */
export default function MetricsStrip() {
  return (
    <section className="shell pb-20">
      <div className="panel overflow-hidden border-t-2 border-t-accent">
        <dl className="grid grid-cols-1 divide-y divide-frame sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics.map((metric) => (
            <div key={metric.unit} className="px-6 py-8">
              <dt className="rail-label uppercase">{metric.unit}</dt>
              <dd className="mt-3 text-metric font-bold text-ink">{metric.value}</dd>
              <p className="mt-2 text-sm text-muted">{metric.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
