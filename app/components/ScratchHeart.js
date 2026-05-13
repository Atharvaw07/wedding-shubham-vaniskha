'use client';

import { useEffect, useRef } from 'react';

/**
 * Scratch-to-reveal heart — canvas behaviour matches the original HTML class ScratchHeart.
 */
export default function ScratchHeart({ label, value, onReveal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isDrawing = false;
    let revealed = false;

    const init = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#B85940';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = "bold 12px 'Cormorant Garamond', serif";
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH', width / 2, height / 2 + 4);
    };

    init();

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const checkProgress = () => {
      if (revealed) return;
      const sampleRate = 32;
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += sampleRate) {
        if (pixels[i] < 128) transparentPixels++;
      }
      if ((transparentPixels / (pixels.length / sampleRate)) * 100 > 45) revealAll();
    };

    const revealAll = () => {
      if (revealed) return;
      revealed = true;
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
        onReveal();
      }, 1000);
    };

    const scratch = (e) => {
      if (!isDrawing || revealed) return;
      if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
      const pos = getMousePos(e);
      const rect = container.getBoundingClientRect();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, rect.width * 0.22, 0, Math.PI * 2);
      ctx.fill();
      if (Math.random() > 0.2) checkProgress();
    };

    const onDown = (e) => {
      isDrawing = true;
      scratch(e);
    };
    const onUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [onReveal, label, value]);

  return (
    <div className="heart-container" ref={containerRef}>
      <div className="hidden-content">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
      </div>
      <canvas ref={canvasRef} className="scratch-canvas" />
    </div>
  );
}
