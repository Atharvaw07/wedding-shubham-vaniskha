'use client';

import { useState } from 'react';

const EXTRA_IDS = ['events-card', 'extra-cards', 'mood-card'];
const RSVP_API = process.env.NEXT_PUBLIC_RSVP_API_URL || 'https://wedding-backend-k67l.onrender.com/api/rsvp';

const COPY = {
  sectionLabel: 'Join the Celebration',
  heading: 'Celebrate With Us',
  intro: 'A few fun questions before the big day!',
};

function buildRsvpEventTitles(events) {
  const items = Array.isArray(events?.items) ? events.items : [];
  const seen = new Set();
  const titles = [];
  for (const it of items) {
    const t = (it?.title || '').trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    titles.push(t);
  }
  return titles;
}

function displayName(primary, fallback) {
  const s = (primary || '').trim() || (fallback || '').trim();
  return s || '';
}

export default function RSVPSection({ rsvp, events, hero, footer, onShowModal }) {
  const [decline, setDecline] = useState(false);

  if (rsvp?.enabled === false) return null;

  const clientId = rsvp?.clientId || 'wedding-rsvp';
  const rsvpEventTitles = buildRsvpEventTitles(events);

  const brideName = displayName(hero?.bride?.name, footer?.brideName) || 'Bride';
  const groomName = displayName(hero?.groom?.name, footer?.groomName) || 'Groom';
  const brideInitial = (brideName.charAt(0) || 'B').toUpperCase();
  const groomInitial = (groomName.charAt(0) || 'G').toUpperCase();

  const handleAttendingChange = (isNo) => {
    setDecline(isNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('#submit-btn');
    const btnText = form.querySelector('#btn-text');
    const btnSpinner = form.querySelector('#btn-spinner');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnSpinner.style.display = 'inline';

    const formData = new FormData(form);
    const data = {};
    for (const key of formData.keys()) {
      const values = formData.getAll(key);
      data[key] = values.length > 1 ? values.join(', ') : values[0];
    }
    data.clientId = clientId;
    if (data.attending === 'no') data.events = 'None';

    try {
      const res = await fetch(RSVP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      onShowModal(result.success ? 'success' : 'error');
      if (result.success) {
        form.reset();
        setDecline(false);
        EXTRA_IDS.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.style.opacity = '1';
            el.style.pointerEvents = '';
          }
        });
      }
    } catch {
      onShowModal('error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Love';
      btnSpinner.style.display = 'none';
    }
  };

  return (
    <section id="rsvp-section">
      <div className="text-center reveal">
        <span className="section-label">{COPY.sectionLabel}</span>
        <h2 className="section-heading" style={{ fontSize: '2.9rem', paddingTop: '1rem', color: 'var(--terracotta)' }}>
          {COPY.heading}
        </h2>
        <p
          className="reveal reveal-delay-2 mt-4"
          style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '2.5rem' }}
        >
          {COPY.intro}
        </p>
      </div>

      <form id="rsvp-form" className="rsvp-form" onSubmit={handleSubmit}>
        <div className="form-card reveal">
          <p className="form-card-title">Guest Details</p>
          <div className="field-group">
            <label className="field-label" htmlFor="f-name">
              Your Name
            </label>
            <input className="field-input" type="text" id="f-name" name="name" required placeholder="Full name" autoComplete="name" />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="f-phone">
              Phone Number
            </label>
            <input className="field-input" type="tel" id="f-phone" name="phone" required placeholder="+91 00000 00000" autoComplete="tel" />
          </div>

          <div className="field-group" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <span className="field-label">Will you be attending?</span>
            <div className="radio-pill-row">
              <label className="radio-pill">
                <input type="radio" name="attending" value="yes" required onChange={() => handleAttendingChange(false)} /> Joyfully Accept
              </label>
              <label className="radio-pill">
                <input type="radio" name="attending" value="no" onChange={() => handleAttendingChange(true)} /> Regretfully Decline
              </label>
            </div>
          </div>
        </div>

        {rsvpEventTitles.length > 0 ? (
          <div
            className="form-card reveal reveal-delay-1"
            id="events-card"
            style={{ opacity: decline ? 0.4 : 1, pointerEvents: decline ? 'none' : '' }}
          >
            <p className="form-card-title">Events Attending</p>
            <p className="form-card-subtitle">Select all that apply</p>
            <div className="checkbox-row">
              {rsvpEventTitles.map((title) => (
                <label key={title} className="checkbox-pill">
                  <input type="checkbox" name="events" value={title} /> <span>{title}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className="form-card reveal reveal-delay-1"
          id="extra-cards"
          style={{ opacity: decline ? 0.4 : 1, pointerEvents: decline ? 'none' : '' }}
        >
          <p className="form-card-title">Make a Guess</p>
          <p className="form-card-subtitle">Who will get emotional first?</p>
          <div className="circle-select">
            <label className="circle-opt">
              <input type="radio" name="guess_emotional_first" value={brideName} />
              <div className="circle-face" style={{ fontFamily: 'var(--font-great-vibes), cursive' }}>
                {brideInitial}
              </div>
              <span className="circle-opt-label">{brideName}</span>
            </label>
            <label className="circle-opt">
              <input type="radio" name="guess_emotional_first" value={groomName} />
              <div className="circle-face" style={{ fontFamily: 'var(--font-great-vibes), cursive' }}>
                {groomInitial}
              </div>
              <span className="circle-opt-label">{groomName}</span>
            </label>
            <label className="circle-opt">
              <input type="radio" name="guess_emotional_first" value="Both" />
              <div className="circle-face" style={{ fontFamily: 'var(--font-great-vibes), cursive' }}>
                B
              </div>
              <span className="circle-opt-label">Both</span>
            </label>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: '1rem' }}>
            Reveal after the wedding 😉
          </p>
        </div>

        <div
          className="form-card reveal reveal-delay-2"
          id="mood-card"
          style={{ opacity: decline ? 0.4 : 1, pointerEvents: decline ? 'none' : '' }}
        >
          <p className="form-card-title">Your Wedding Mood</p>
          <p className="form-card-subtitle">I&apos;m coming for...</p>
          <div className="mood-grid">
            <label className="mood-opt">
              <input type="radio" name="wedding_mood" value="The Food" /> The Food 🍛
            </label>
            <label className="mood-opt">
              <input type="radio" name="wedding_mood" value="The Dance Floor" /> Dance Floor 💃
            </label>
            <label className="mood-opt">
              <input type="radio" name="wedding_mood" value="The Love" /> The Love ❤️
            </label>
            <label className="mood-opt">
              <input type="radio" name="wedding_mood" value="All of It" /> All of It ✨
            </label>
          </div>
        </div>

        <div className="form-card reveal reveal-delay-2">
          <p className="form-card-title">Leave Us a Note</p>
          <p className="form-card-subtitle">Share a wish or memory.</p>
          <textarea className="text-area" name="message" rows={3} placeholder="Write something from the heart..." />
        </div>

        <div className="form-card reveal reveal-delay-3">
          <p className="form-card-title">Words for Forever</p>
          <p className="form-card-subtitle">Advice for married life.</p>
          <textarea className="text-area" name="advice_for_forever" rows={3} placeholder="One piece of advice..." />
        </div>

        <div className="reveal reveal-delay-3" style={{ marginTop: '2rem' }}>
          <button type="submit" className="submit-btn" id="submit-btn">
            <span id="btn-text">Send Love</span>
            <svg
              id="btn-spinner"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ display: 'none', verticalAlign: 'middle', marginLeft: '8px' }}
              className="spin"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0110 10" strokeOpacity="0.75" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
