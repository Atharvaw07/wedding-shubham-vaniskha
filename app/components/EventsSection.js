'use client';

import { Fragment } from 'react';

function EventSep() {
  return (
    <div className="event-sep reveal">
      <div className="event-sep-line" />
      <div className="event-sep-dot" />
      <div className="event-sep-line" />
    </div>
  );
}

const INVITE_STYLES = new Set(['arch', 'sunset', 'light', 'dark']);

const COPY = {
  sectionLabel: 'The Celebration Unfolds',
  headingHtml: 'Sacred<br>Ceremonies',
};

function isVideoBackgroundSrc(src) {
  if (!src || typeof src !== 'string') return false;
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(src);
}

function EventCard({ item }) {
  const style = INVITE_STYLES.has(item?.inviteStyle) ? item.inviteStyle : 'arch';
  const cls = `event-invite-frame event-invite--${style}`;
  const bg = item?.backgroundImage;
  const showVideo = bg && isVideoBackgroundSrc(bg);

  return (
    <div className="event-block reveal">
      <div className={cls}>
        {bg && showVideo ? (
          <video
            className="event-invite-bg"
            autoPlay
            muted
            loop
            playsInline
            src={bg}
            aria-hidden
          />
        ) : bg ? (
          <img
            className="event-invite-bg"
            src={bg}
            alt=""
            width={1080}
            height={1920}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="event-invite-overlay">
          <div className="event-invite-stack">
            <h3 className="event-invite-title">{item?.title}</h3>
            <div className="event-date-row">
              <span>{item?.weekday}</span>
              <span className="event-date-bar">|</span>
              <span className="event-date-num">{item?.dateNumber}</span>
              <span className="event-date-bar">|</span>
              <span>{item?.monthYear}</span>
            </div>
            <p className="event-invite-time">{item?.time}</p>
            <p className="event-invite-loc">{item?.venueOnCard}</p>
          </div>
        </div>
      </div>
      {item?.mapsUrl ? (
        <div className="event-venue-card reveal reveal-delay-1">
          <span className="event-venue-name">{item?.venueCardLine || `Venue: ${item?.venueOnCard || ''}`}</span>
          <a className="event-dir-btn" href={item.mapsUrl} target="_blank" rel="noopener noreferrer">
            View on Maps
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function EventsSection({ events }) {
  if (events?.enabled === false) return null;

  const items = Array.isArray(events?.items) ? events.items : [];

  return (
    <section id="events-section">
      <div className="text-center reveal" style={{ marginBottom: '3rem' }}>
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

      {items.map((item, i) => (
        <Fragment key={i}>
          <EventCard item={item} />
          {item?.showDividerAfter !== false ? <EventSep /> : null}
        </Fragment>
      ))}
    </section>
  );
}
