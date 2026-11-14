// Interactive 3D Rotating Architectural Wireframe & Air-Sole Cross-Section of Air Jordan 1 High OG
export function initSpecsCanvas(canvas: HTMLCanvasElement | null): () => void {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = 0.45;
  const targetSpeed = 0.007;
  let hoverBoost = 0;
  let rafId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const onEnter = () => {
    hoverBoost = 0.016;
  };
  const onLeave = () => {
    hoverBoost = 0;
  };

  const parent = canvas.parentElement;
  parent?.addEventListener('pointerenter', onEnter);
  parent?.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Silhouette profile points (x: length along sole, y: height) for a 3D extruded Air Jordan 1 wireframe
  const profileTop: [number, number][] = [
    [-0.95, -0.05], // toe tip
    [-0.78, 0.1],   // toe box upper
    [-0.42, 0.16],  // vamp / eyestay base
    [-0.1, 0.56],   // tongue front
    [0.14, 0.72],   // collar front peak
    [0.54, 0.74],   // ankle collar top
    [0.64, 0.36],   // achilles curve
    [0.72, 0.0],    // heel counter
    [0.74, -0.22],  // outsole heel
  ];

  const profileSole: [number, number][] = [
    [-0.95, -0.05],
    [-0.92, -0.22],
    [-0.3, -0.24],
    [0.25, -0.24],
    [0.74, -0.22],
  ];

  const airUnit: [number, number][] = [
    [0.24, -0.1],
    [0.58, -0.1],
    [0.58, -0.19],
    [0.24, -0.19],
  ];

  const draw = () => {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const strokeMain = isDark
      ? 'rgba(243, 241, 242, 0.28)'
      : 'rgba(18, 17, 18, 0.24)';
    const strokeAccent = isDark
      ? 'rgba(217, 30, 54, 0.92)'
      : 'rgba(200, 16, 46, 0.88)';
    const strokeGrid = isDark
      ? 'rgba(243, 241, 242, 0.09)'
      : 'rgba(18, 17, 18, 0.08)';

    const cx = w * 0.62;
    const cy = h * 0.45;
    const scale = Math.min(w, h) * 0.38;

    if (!prefersReduced) {
      angle += targetSpeed + hoverBoost;
    }

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const tilt = 0.22;

    const project = (x: number, y: number, z: number): [number, number] => {
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA;
      const ry = y + rz * tilt;
      return [cx + rx * scale, cy - ry * scale];
    };

    // Subtle concentric pivot-circle projection on floor plane
    ctx.lineWidth = Math.max(1, w / 520);
    for (const r of [0.22, 0.42]) {
      ctx.beginPath();
      ctx.strokeStyle = strokeGrid;
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const [px, py] = project(-0.4 + Math.cos(a) * r, -0.25, Math.sin(a) * r);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    const zSlices = [-0.22, 0.0, 0.22];
    ctx.lineWidth = Math.max(1.2, w / 420);

    // Draw outer & inner shoe silhouette slices
    for (let s = 0; s < zSlices.length; s++) {
      const z = zSlices[s];
      ctx.beginPath();
      ctx.strokeStyle = s === 1 ? strokeMain : strokeGrid;
      const fullLoop = [...profileTop, ...[...profileSole].reverse()];
      fullLoop.forEach(([x, y], idx) => {
        const [px, py] = project(x, y, z);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();

      // Midsole stitch line
      ctx.beginPath();
      ctx.strokeStyle = strokeMain;
      const [sx1, sy1] = project(-0.92, -0.07, z);
      const [sx2, sy2] = project(0.73, -0.07, z);
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }

    // Cross-ribs connecting lateral and medial walls
    const ribPoints = [0, 2, 4, 5, 7];
    ctx.strokeStyle = strokeMain;
    for (const idx of ribPoints) {
      const [x, y] = profileTop[idx];
      const [px1, py1] = project(x, y, -0.22);
      const [px2, py2] = project(x, y, 0.22);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
    }

    // Highlighted Encapsulated Nike Air-Sole Unit in heel chamber
    ctx.lineWidth = Math.max(1.6, w / 340);
    for (const z of [-0.14, 0.14]) {
      ctx.beginPath();
      ctx.strokeStyle = strokeAccent;
      airUnit.forEach(([x, y], idx) => {
        const [px, py] = project(x, y, z);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
    }

    for (const [x, y] of airUnit) {
      const [px1, py1] = project(x, y, -0.14);
      const [px2, py2] = project(x, y, 0.14);
      ctx.beginPath();
      ctx.strokeStyle = strokeAccent;
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
    }

    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    parent?.removeEventListener('pointerenter', onEnter);
    parent?.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', resize);
  };
}
