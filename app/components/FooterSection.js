'use client';

const DESIGNER_CREDIT_TEXT = 'HOUSE OF INVITATION';
const DESIGNER_CREDIT_URL =
  'https://www.instagram.com/house_of_invitation_?igsh=azBiaXM4eWptZXp0';

export default function FooterSection({ footer }) {
  if (footer?.enabled === false) return null;

  const bride = footer?.brideName || 'Bride';
  const groom = footer?.groomName || 'Groom';

  return (
    <section id="footer-section">
      <div className="reveal" style={{ width: '100%' }}>
        <span
          style={{
            fontFamily: 'var(--font-great-vibes), cursive',
            fontSize: 'clamp(5rem, 18vw, 8rem)',
            color: 'var(--gold-light)',
            display: 'block',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          {bride}
          <br />
          <span style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', color: 'var(--gold)', display: 'block', margin: '0.2rem 0' }}>&</span>
          {groom}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem', opacity: 0.4 }}>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-light)' }} />
          <span style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>♥</span>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-light)' }} />
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '4rem',
          fontFamily: 'var(--font-cormorant-garamond), serif',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.6)',
        }}
        className="reveal"
      >
        MADE WITH <span style={{ color: '#e74c3c' }}>♥</span> BY{' '}
        <a
          href={DESIGNER_CREDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--gold-light)', textDecoration: 'none' }}
        >
          {DESIGNER_CREDIT_TEXT}
        </a>
      </div>
    </section>
  );
}
