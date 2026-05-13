'use client';

const HERO_BG_VIDEO_SRC =
  'https://pub-1953a6673e864f3488c645252f75de98.r2.dev/common-assets/Background.mp4';

function Lines({ text, className, style }) {
  if (!text) return null;
  const parts = text.split('\n');
  return (
    <p className={className} style={style}>
      {parts.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  );
}

export default function HeroSection({ hero }) {
  if (hero?.enabled === false) return null;

  return (
    <section id="hero">
      <video id="hero-bg-video" autoPlay loop muted playsInline>
        <source src={HERO_BG_VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="hero-frame">
        <span />
      </div>

      <div className="hero-card">
        {hero?.ganeshImageUrl ? (
          <img
            className="ganesh-icon"
            src={hero.ganeshImageUrl}
            alt=""
            width={80}
            height={80}
            loading="eager"
          />
        ) : null}
        <Lines
          text={hero?.blessingSanskrit}
          style={{
            fontFamily: 'var(--font-cormorant-garamond), serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--terracotta)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        />

        <Lines text={hero?.blessingsIntro} className="blessings-text" />

        <div className="couple-block">
          <span className="couple-name shimmer-gold">{hero?.bride?.name || 'Bride'}</span>
          <p className="family-line">{hero?.bride?.familyLine}</p>
          {hero?.bride?.familySubline ? <p className="family-subline">{hero.bride.familySubline}</p> : null}
        </div>

        <div className="ampersand-wrap">
          <div className="ampersand-line" />
          <span className="ampersand">&</span>
          <div className="ampersand-line" />
        </div>

        <div className="couple-block">
          <span className="couple-name shimmer-gold">{hero?.groom?.name || 'Groom'}</span>
          <p className="family-line">{hero?.groom?.familyLine}</p>
          {hero?.groom?.familySubline ? <p className="family-subline">{hero.groom.familySubline}</p> : null}
        </div>
      </div>

      <div className="scroll-cue">
        <p>Scroll</p>
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
