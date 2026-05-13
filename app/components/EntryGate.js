'use client';

export default function EntryGate({
  hidden,
  fading,
  playOverlayHidden,
  onGateClick,
  entryVideoRef,
  onVideoEnded,
  onVideoError,
  videoSrc,
}) {
  if (hidden) return null;

  return (
    <div
      id="entry-gate"
      className={fading ? 'fade-out' : ''}
      onClick={onGateClick}
      onKeyDown={(e) => e.key === 'Enter' && onGateClick()}
      role="button"
      tabIndex={0}
    >
      <div className="entry-video-container">
        <video
          id="entry-video"
          ref={entryVideoRef}
          playsInline
          preload="auto"
          muted
          onEnded={onVideoEnded}
          onError={onVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <div id="play-overlay" className={playOverlayHidden ? 'hidden' : ''} />
    </div>
  );
}
