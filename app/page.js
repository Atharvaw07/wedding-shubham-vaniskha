'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import defaultData from '../data.json';
import { mergeSiteData } from './mergeSiteData';
import Petals from './components/Petals';
import AudioControl from './components/AudioControl';
import EntryGate from './components/EntryGate';
import HeroSection from './components/HeroSection';
import ScratchRevealSection from './components/ScratchRevealSection';
import MemoriesSection from './components/MemoriesSection';
import EventsSection from './components/EventsSection';
import RSVPSection from './components/RSVPSection';
import FooterSection from './components/FooterSection';
import RsvpModal from './components/RsvpModal';

const API = process.env.NEXT_PUBLIC_PLATFORM_API_URL || 'http://localhost:5000';

function WeddingPageInner() {
  const searchParams = useSearchParams();
  const pid = searchParams?.get('pid');

  const [siteData, setSiteData] = useState(defaultData);
  const siteDataRef = useRef(siteData);
  siteDataRef.current = siteData;

  const [dataReady, setDataReady] = useState(!pid);

  const [mainRevealed, setMainRevealed] = useState(false);
  const [gateFading, setGateFading] = useState(false);
  const [gateHidden, setGateHidden] = useState(false);
  const [playOverlayHidden, setPlayOverlayHidden] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [petalsActive, setPetalsActive] = useState(false);
  const [scratchEnabled, setScratchEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('success');

  const audioRef = useRef(null);
  const entryVideoRef = useRef(null);
  const mainRevealedRef = useRef(false);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!pid) return undefined;
    fetch(`${API}/api/preview/${pid}/data`)
      .then((r) => r.json())
      .then((res) => {
        const patch = res.project?.data;
        if (
          res.success &&
          patch != null &&
          typeof patch === 'object' &&
          !Array.isArray(patch)
        ) {
          setSiteData(mergeSiteData(defaultData, patch));
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, [pid]);

  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
    ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach((evt) => window.removeEventListener(evt, handleUserInteraction));
  }, []);

  const showEntryGate = siteData.entry?.enabled !== false;

  useEffect(() => {
    if (!dataReady || showEntryGate) return;
    if (mainRevealedRef.current) return;
    mainRevealedRef.current = true;
    setGateHidden(true);
    setMainRevealed(true);
    setPetalsActive(true);
    setScratchEnabled(siteDataRef.current.saveTheDate?.enabled !== false);
    setTimeout(() => {
      ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach((evt) =>
        window.addEventListener(evt, handleUserInteraction, { passive: true })
      );
    }, 1000);
    setTimeout(() => {
      if (!userInteractedRef.current) {
        const tgt =
          document.getElementById('scratch-reveal-section') ||
          document.getElementById('memories-section') ||
          document.getElementById('events-section') ||
          document.getElementById('hero');
        if (tgt) window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      }
    }, 5000);
  }, [dataReady, showEntryGate, handleUserInteraction]);

  useEffect(() => {
    document.body.style.overflow = mainRevealed ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mainRevealed]);

  const revealMain = useCallback(() => {
    if (mainRevealedRef.current) return;
    mainRevealedRef.current = true;
    setGateFading(true);
    setTimeout(() => setGateHidden(true), 900);
    setMainRevealed(true);
    setPetalsActive(true);
    setScratchEnabled(siteDataRef.current.saveTheDate?.enabled !== false);
    setTimeout(() => {
      ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach((evt) =>
        window.addEventListener(evt, handleUserInteraction, { passive: true })
      );
    }, 1000);
    setTimeout(() => {
      if (!userInteractedRef.current) {
        const tgt =
          document.getElementById('scratch-reveal-section') ||
          document.getElementById('memories-section') ||
          document.getElementById('events-section') ||
          document.getElementById('hero');
        if (tgt) window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      }
    }, 5000);
  }, [handleUserInteraction]);

  useEffect(() => {
    if (!mainRevealed) return undefined;
    const id = window.setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const o = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((i) => {
              if (i.isIntersecting) {
                i.target.classList.add('revealed');
                obs.disconnect();
              }
            });
          },
          { threshold: 0.1 }
        );
        o.observe(el);
      });
    }, 0);
    return () => clearTimeout(id);
  }, [mainRevealed]);

  const onGateClick = async () => {
    if (mainRevealedRef.current) return;
    setPlayOverlayHidden(true);
    const entryVideo = entryVideoRef.current;
    const bgAudio = audioRef.current;
    try {
      if (entryVideo) {
        entryVideo.muted = false;
        await entryVideo.play();
      }
      try {
        if (bgAudio) {
          await bgAudio.play();
          setAudioPlaying(true);
        }
      } catch {
        /* ignore */
      }
    } catch {
      if (entryVideo) {
        entryVideo.muted = true;
        try {
          await entryVideo.play();
        } catch {
          revealMain();
        }
      }
    }
  };

  const onVideoEnded = () => revealMain();
  const onVideoError = () => revealMain();

  const toggleAudio = async (e) => {
    e.stopPropagation();
    const bgAudio = audioRef.current;
    if (!bgAudio) return;
    if (audioPlaying) {
      bgAudio.pause();
      setAudioPlaying(false);
    } else {
      try {
        await bgAudio.play();
        setAudioPlaying(true);
      } catch {
        /* ignore */
      }
    }
  };

  if (!dataReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0505',
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
        }}
      >
        Loading…
      </div>
    );
  }

  const d = siteData;
  const petalsOn = d.petalsEnabled !== false;
  const audioOn = d.audio?.enabled !== false && !!d.audio?.src;

  return (
    <>
      <Petals active={petalsActive && petalsOn} />

      {audioOn ? (
        <audio id="bg-audio" ref={audioRef} loop preload="none">
          <source src={d.audio.src} type="audio/mpeg" />
        </audio>
      ) : null}

      {audioOn ? <AudioControl audioPlaying={audioPlaying} onToggle={toggleAudio} /> : null}

      {showEntryGate ? (
        <EntryGate
          hidden={gateHidden}
          fading={gateFading}
          playOverlayHidden={playOverlayHidden}
          onGateClick={onGateClick}
          entryVideoRef={entryVideoRef}
          onVideoEnded={onVideoEnded}
          onVideoError={onVideoError}
          videoSrc={d.entry?.videoSrc || ''}
        />
      ) : null}

      <div id="main-content" className={mainRevealed ? 'visible fade-in' : ''}>
        <HeroSection hero={d.hero} />
        <ScratchRevealSection enabled={scratchEnabled} saveTheDate={d.saveTheDate} />
        <MemoriesSection memories={d.memories} />
        <EventsSection events={d.events} />
        <RSVPSection
          rsvp={d.rsvp}
          events={d.events}
          hero={d.hero}
          footer={d.footer}
          onShowModal={(type) => { setModalType(type); setModalOpen(true); }}
        />
        <FooterSection footer={d.footer} />
      </div>

      <RsvpModal open={modalOpen} type={modalType} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0505' }} />}>
      <WeddingPageInner />
    </Suspense>
  );
}
