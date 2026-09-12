import { useEffect, useRef, useState } from 'react';

const PARTICLES = Array.from({ length: 42 }, (_, i) => ({
  left: 18 + ((i * 37) % 65),
  top: 18 + ((i * 53) % 62),
  dx: ((i % 7) - 3) * 18,
  dy: -45 - ((i * 11) % 80),
  delay: (i % 9) * 28,
}));

export function OttoSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(false);
  const [dissolving, setDissolving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.src = '/otto.png';
    image.onload = () => {
      const size = 700;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(image, x, y, width, height);

      // If the source image has a black square baked into it, remove only
      // dark pixels connected to the outer edge. Dark details inside Otto stay intact.
      try {
        const frame = ctx.getImageData(0, 0, size, size);
        const data = frame.data;
        const total = size * size;
        const visited = new Uint8Array(total);
        const queue = new Int32Array(total);
        let head = 0;
        let tail = 0;

        const isDark = (pixel: number) => {
          const p = pixel * 4;
          if (data[p + 3] < 20) return true;
          return data[p] < 72 && data[p + 1] < 72 && data[p + 2] < 72;
        };
        const push = (pixel: number) => {
          if (pixel < 0 || pixel >= total || visited[pixel] || !isDark(pixel)) return;
          visited[pixel] = 1;
          queue[tail++] = pixel;
        };

        for (let px = 0; px < size; px += 1) {
          push(px);
          push((size - 1) * size + px);
        }
        for (let py = 0; py < size; py += 1) {
          push(py * size);
          push(py * size + size - 1);
        }

        while (head < tail) {
          const pixel = queue[head++];
          const px = pixel % size;
          const py = Math.floor(pixel / size);
          data[pixel * 4 + 3] = 0;
          if (px > 0) push(pixel - 1);
          if (px < size - 1) push(pixel + 1);
          if (py > 0) push(pixel - size);
          if (py < size - 1) push(pixel + size);
        }
        ctx.putImageData(frame, 0, 0);
      } catch {
        // The original image remains visible if pixel processing is unavailable.
      }
    };
  }, []);

  useEffect(() => {
    const reveal = window.setTimeout(() => setVisible(true), 2500);
    const dissolve = window.setTimeout(() => setDissolving(true), 6500);
    const finish = window.setTimeout(() => setActive(false), 8000);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(dissolve);
      window.clearTimeout(finish);
    };
  }, []);

  if (!active) return null;

  return (
    <div className={`otto-splash ${dissolving ? 'otto-splash--dissolve' : ''}`} aria-hidden="true">
      <div className="otto-splash__glow" />
      <canvas
        ref={canvasRef}
        className={`otto-splash__character ${visible ? 'otto-splash__character--visible' : ''}`}
      />
      <div className="otto-splash__particles">
        {PARTICLES.map((particle, i) => (
          <i
            key={i}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              '--dx': `${particle.dx}px`,
              '--dy': `${particle.dy}px`,
              '--delay': `${particle.delay}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
