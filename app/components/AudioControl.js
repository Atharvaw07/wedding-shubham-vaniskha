'use client';

export default function AudioControl({ audioPlaying, onToggle }) {
  return (
    <button id="audio-btn" type="button" title="Toggle music" aria-label="Toggle background music" onClick={onToggle}>
      <svg id="icon-on" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ display: audioPlaying ? '' : 'none' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
      </svg>
      <svg id="icon-off" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ display: audioPlaying ? 'none' : '' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
      </svg>
    </button>
  );
}
