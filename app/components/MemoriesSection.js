'use client';

const COPY = {
  sectionLabel: 'A Glimpse of Us',
  headingHtml: 'Our Beautiful<br>Moments',
  footnote: 'A moment captured in time, forever in our hearts',
};

function isVideoUrl(src) {
  if (!src || typeof src !== 'string') return false;
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(src);
}

export default function MemoriesSection({ memories }) {
  if (memories?.enabled === false) return null;

  const src = memories?.videoSrc;
  const showVideo = src && isVideoUrl(src);

  return (
    <section id="memories-section">
      <div className="text-center reveal">
        <span className="section-label">{COPY.sectionLabel}</span>
        <h2
          className="section-heading"
          style={{ color: 'var(--terracotta)' }}
          dangerouslySetInnerHTML={{ __html: COPY.headingHtml }}
        />
        <div className="ornament mt-4">
          <div className="ornament-line rev" />
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <div className="ornament-line" />
        </div>
      </div>

      {src ? (
        <div className="memories-frame reveal reveal-delay-2">
          <div className="memories-inner">
            {showVideo ? (
              <video autoPlay loop muted playsInline src={src} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" loading="lazy" decoding="async" width={1080} height={1600} />
            )}
          </div>
        </div>
      ) : null}
      {src ? (
        <p className="text-center reveal reveal-delay-3 mt-8" style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '1.1rem' }}>
          {COPY.footnote}
        </p>
      ) : null}
    </section>
  );
}
