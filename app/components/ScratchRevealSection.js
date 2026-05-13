'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import ScratchHeart from './ScratchHeart';

const pad = (n) => String(n).padStart(2, '0');

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const COPY = {
  sectionLabel: 'Save The Date',
  headingHtml: 'Reveal Our<br>Big Day',
  hintText: 'Scratch the hearts to reveal',
  surpriseText: 'The start of a beautiful journey...',
};

/** Prefer weddingDate (YYYY-MM-DD); else legacy scratch + countdownTarget fields. */
function resolveSaveTheDate(std) {
  if (!std?.weddingDate) {
    return {
      countdownTarget: std?.countdownTarget || 'January 1, 2026 00:00:00',
      scratchDay: std?.scratchDay ?? '01',
      scratchMonth: std?.scratchMonth ?? 'January',
      scratchYear: std?.scratchYear ?? '2026',
    };
  }
  const d = new Date(`${std.weddingDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return {
      countdownTarget: std?.countdownTarget || 'January 1, 2026 00:00:00',
      scratchDay: std?.scratchDay ?? '01',
      scratchMonth: std?.scratchMonth ?? 'January',
      scratchYear: std?.scratchYear ?? '2026',
    };
  }
  const m = MONTHS_LONG[d.getMonth()];
  const day = d.getDate();
  const y = d.getFullYear();
  return {
    countdownTarget: `${m} ${day}, ${y} 00:00:00`,
    scratchDay: String(day),
    scratchMonth: m,
    scratchYear: String(y),
  };
}

export default function ScratchRevealSection({ enabled, saveTheDate }) {
  const resolved = resolveSaveTheDate(saveTheDate || {});
  const weddingDateString = resolved.countdownTarget;
  const scratchDay = resolved.scratchDay;
  const scratchMonth = resolved.scratchMonth;
  const scratchYear = resolved.scratchYear;
  const surpriseText = COPY.surpriseText;

  const [unlocked, setUnlocked] = useState(false);
  const [surpriseOn, setSurpriseOn] = useState(false);
  const [cd, setCd] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [cdVisible, setCdVisible] = useState(false);
  const revealedCount = useRef(0);
  const countdownInterval = useRef(null);

  const startCountdown = useCallback(() => {
    const weddingDate = new Date(weddingDateString).getTime();
    const tick = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance < 0) {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        setCd({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setCd({
        d: pad(Math.floor(distance / (1000 * 60 * 60 * 24))),
        h: pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        m: pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        s: pad(Math.floor((distance % (1000 * 60)) / 1000)),
      });
    };
    tick();
    countdownInterval.current = setInterval(tick, 1000);
    setCdVisible(true);
  }, [weddingDateString]);

  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const onHeartReveal = useCallback(() => {
    revealedCount.current += 1;
    if (revealedCount.current !== 3) return;
    setUnlocked(true);
    setTimeout(() => {
      setSurpriseOn(true);
      startCountdown();
    }, 500);

    setTimeout(() => {
      const end = Date.now() + 1500;
      const colors = ['#B85940', '#C9963E', '#E8C07A', '#FFFFFF'];
      (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors, zIndex: 9999 });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }, 800);
  }, [startCountdown]);

  if (saveTheDate?.enabled === false) return null;

  return (
    <section id="scratch-reveal-section">
      <div className="text-center reveal">
        <span className="section-label">{COPY.sectionLabel}</span>
        <h2
          className="section-heading"
          style={{ color: 'var(--terracotta)' }}
          dangerouslySetInnerHTML={{ __html: COPY.headingHtml }}
        />
        <p
          className="reveal reveal-delay-2 mt-4"
          style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '1rem' }}
        >
          {COPY.hintText}
        </p>
      </div>

      <div className={`hearts-row reveal reveal-delay-2 ${unlocked ? 'unlocked' : ''}`} id="heartsRow">
        {enabled ? (
          <>
            <ScratchHeart label="DAY" value={scratchDay} onReveal={onHeartReveal} />
            <ScratchHeart label="MONTH" value={scratchMonth} onReveal={onHeartReveal} />
            <ScratchHeart label="YEAR" value={scratchYear} onReveal={onHeartReveal} />
          </>
        ) : null}
      </div>

      <div className="text-center">
        <div id="surpriseMessage" className={`surprise-message ${surpriseOn ? 'revealed' : ''}`}>
          {surpriseText}
        </div>
        <div id="countdown-container" className={`countdown-container ${cdVisible ? 'revealed' : ''}`}>
          <div className="cd-item">
            <span id="cd-days">{cd.d}</span>
            <small>Days</small>
          </div>
          <div className="cd-item">
            <span id="cd-hours">{cd.h}</span>
            <small>Hrs</small>
          </div>
          <div className="cd-item">
            <span id="cd-mins">{cd.m}</span>
            <small>Mins</small>
          </div>
          <div className="cd-item">
            <span id="cd-secs">{cd.s}</span>
            <small>Secs</small>
          </div>
        </div>
      </div>
    </section>
  );
}
