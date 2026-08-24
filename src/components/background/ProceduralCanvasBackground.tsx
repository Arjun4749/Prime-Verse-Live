import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../../config/backgroundConfigs';

interface ProceduralCanvasBackgroundProps {
  config: BackgroundConfig;
}

interface Tracer {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  speed: number;
  length: number;
  color: string;
  glowColor: string;
  width: number;
  progress: number; // 0 to 1
  isSniper?: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  decay: number;
}

interface MuzzleFlash {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  duration: number;
  maxDuration: number;
  angle: number;
}

interface ScopeReticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: 'sniper' | 'holo' | 'red_dot';
  size: number;
  angle: number;
  locked: boolean;
  lockTimer: number;
  label: string;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  growth: number;
  color: string;
}

export const ProceduralCanvasBackground: React.FC<ProceduralCanvasBackgroundProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Arrays for gun fight components
    let tracers: Tracer[] = [];
    let sparks: Spark[] = [];
    let flashes: MuzzleFlash[] = [];
    let smoke: SmokeParticle[] = [];
    let hitmarkers: { x: number; y: number; opacity: number; size: number }[] = [];

    // Weapon firing origin positions (corners/sides simulating squads in firefight)
    const getFiringOrigins = () => [
      { x: 30, y: height * 0.85, name: 'SQUAD_ALPHA' }, // Bottom left
      { x: width - 40, y: height * 0.8, name: 'SQUAD_BRAVO' }, // Bottom right
      { x: width * 0.1, y: height * 0.25, name: 'SNIPER_NEST' }, // Top left flank
      { x: width * 0.9, y: height * 0.3, name: 'RIDGE_FLANK' }, // Top right ridge
    ];

    // Tactical Target Scopes
    const scopes: ScopeReticle[] = [
      {
        x: width * 0.4,
        y: height * 0.35,
        targetX: width * 0.6,
        targetY: height * 0.5,
        type: 'sniper',
        size: 45,
        angle: 0,
        locked: false,
        lockTimer: 0,
        label: 'AWM 8x [320m]',
      },
      {
        x: width * 0.7,
        y: height * 0.65,
        targetX: width * 0.3,
        targetY: height * 0.4,
        type: 'holo',
        size: 32,
        angle: 0,
        locked: true,
        lockTimer: 100,
        label: 'M416 HOLO [110m]',
      },
    ];

    // Helper: spawn impact spark explosion
    const triggerImpact = (x: number, y: number, color: string = '#FF9900', count: number = 14) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2, // upward bounce bias
          size: Math.random() * 2.5 + 0.8,
          color,
          opacity: 1,
          decay: Math.random() * 0.03 + 0.02,
        });
      }

      // Add hitmarker at impact site
      hitmarkers.push({ x, y, opacity: 1, size: 12 });

      // Add smoke puff at impact point
      for (let s = 0; s < 3; s++) {
        smoke.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.8 - 0.2,
          radius: Math.random() * 8 + 6,
          opacity: 0.4,
          growth: 0.2,
          color: 'rgba(200, 200, 210, 0.25)',
        });
      }
    };

    // Helper: Fire gun burst
    const fireGunBurst = (originX: number, originY: number, targetX: number, targetY: number, rounds: number = 3, isSniper: boolean = false) => {
      const colors = isSniper ? ['#00F0FF', '#3B82F6', '#FFFFFF'] : ['#FF6B00', '#FFD100', '#FF3300', '#00FFCC'];
      const tracerColor = colors[Math.floor(Math.random() * colors.length)];
      const glowColor = isSniper ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 107, 0, 0.8)';

      const dx = targetX - originX;
      const dy = targetY - originY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      // Add Muzzle Flash
      flashes.push({
        x: originX,
        y: originY,
        radius: isSniper ? 35 : Math.random() * 15 + 20,
        opacity: 0.9,
        color: isSniper ? '#38BDF8' : '#F97316',
        duration: 0,
        maxDuration: isSniper ? 8 : 5,
        angle,
      });

      // Spawn tracers with small stagger
      for (let i = 0; i < rounds; i++) {
        setTimeout(() => {
          // slight bullet spread / recoil inaccuracy
          const spread = isSniper ? 0.01 : (Math.random() - 0.5) * 0.08;
          const finalAngle = angle + spread;
          const speed = isSniper ? 28 : Math.random() * 6 + 18;

          tracers.push({
            x: originX,
            y: originY,
            startX: originX,
            startY: originY,
            targetX: originX + Math.cos(finalAngle) * dist,
            targetY: originY + Math.sin(finalAngle) * dist,
            vx: Math.cos(finalAngle) * speed,
            vy: Math.sin(finalAngle) * speed,
            speed,
            length: isSniper ? 80 : Math.random() * 25 + 35,
            color: tracerColor,
            glowColor,
            width: isSniper ? 3.5 : 2,
            progress: 0,
            isSniper,
          });
        }, i * (isSniper ? 0 : 80 + Math.random() * 40));
      }
    };

    // Auto Fire combat loop state
    let lastFireTime = 0;
    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: Deep Gaming Battlefield Atmosphere Gradient ---
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0f121d');
      bgGrad.addColorStop(0.5, '#080a11');
      bgGrad.addColorStop(1, '#030407');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 2: Tactical Cyber Grid & Combat Cross Lines ---
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 70;
      const gridOffset = (time * 12) % gridSize;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();

      // --- LAYER 3: Trigger Firefights Periodically ---
      if (time - lastFireTime > 0.4 + Math.random() * 0.6) {
        lastFireTime = time;
        const origins = getFiringOrigins();
        const origin = origins[Math.floor(Math.random() * origins.length)];

        // Select a target anywhere across screen or towards another squad
        const otherOrigins = origins.filter((o) => o !== origin);
        const targetOrigin = otherOrigins[Math.floor(Math.random() * otherOrigins.length)];

        const targetX = Math.random() > 0.4 ? targetOrigin.x : Math.random() * width;
        const targetY = Math.random() > 0.4 ? targetOrigin.y : Math.random() * height;

        const isSniper = Math.random() < 0.25;
        const roundCount = isSniper ? 1 : Math.floor(Math.random() * 4) + 2;

        fireGunBurst(origin.x, origin.y, targetX, targetY, roundCount, isSniper);
      }

      // --- LAYER 4: Render Muzzle Flashes ---
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.duration += 1;

        const progress = f.duration / f.maxDuration;
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Outer flash glow
        const flashGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * (1 + progress));
        flashGrad.addColorStop(0, '#FFFFFF');
        flashGrad.addColorStop(0.3, f.color);
        flashGrad.addColorStop(0.7, 'rgba(255, 107, 0, 0.3)');
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * (1 + progress), 0, Math.PI * 2);
        ctx.fill();

        // Directional Muzzle Cone Burst
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(f.radius * 2.5, -f.radius * 0.5);
        ctx.lineTo(f.radius * 3.2, 0);
        ctx.lineTo(f.radius * 2.5, f.radius * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        if (f.duration >= f.maxDuration) {
          flashes.splice(i, 1);
        }
      }

      // --- LAYER 5: Render Bullet Tracers ---
      for (let i = tracers.length - 1; i >= 0; i--) {
        const t = tracers[i];
        t.x += t.vx;
        t.y += t.vy;

        const dx = t.x - t.startX;
        const dy = t.y - t.startY;
        const distMoved = Math.hypot(dx, dy);
        const totalDist = Math.hypot(t.targetX - t.startX, t.targetY - t.startY);

        // Draw Tracer Line
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const tailX = t.x - (t.vx / t.speed) * t.length;
        const tailY = t.y - (t.vy / t.speed) * t.length;

        const tracerGrad = ctx.createLinearGradient(tailX, tailY, t.x, t.y);
        tracerGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        tracerGrad.addColorStop(0.5, t.glowColor);
        tracerGrad.addColorStop(1, '#FFFFFF');

        ctx.strokeStyle = tracerGrad;
        ctx.lineWidth = t.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = t.isSniper ? 15 : 8;
        ctx.shadowColor = t.color;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();

        ctx.restore();

        // Check target hit or screen exit
        if (distMoved >= totalDist || t.x < -50 || t.x > width + 50 || t.y < -50 || t.y > height + 50) {
          if (distMoved >= totalDist) {
            triggerImpact(t.targetX, t.targetY, t.color, t.isSniper ? 24 : 12);
          }
          tracers.splice(i, 1);
        }
      }

      // --- LAYER 6: Render Impact Sparks ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // gravity
        s.opacity -= s.decay;

        if (s.opacity <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.max(0, s.opacity);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- LAYER 7: Render Gunfire Smoke & Ambient Vapor ---
      for (let i = smoke.length - 1; i >= 0; i--) {
        const sm = smoke[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.radius += sm.growth;
        sm.opacity -= 0.006;

        if (sm.opacity <= 0) {
          smoke.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, sm.opacity);
        const smGrad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, sm.radius);
        smGrad.addColorStop(0, 'rgba(255, 120, 30, 0.15)');
        smGrad.addColorStop(0.5, 'rgba(50, 55, 70, 0.1)');
        smGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = smGrad;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- LAYER 8: Render Hitmarkers ---
      for (let i = hitmarkers.length - 1; i >= 0; i--) {
        const hm = hitmarkers[i];
        hm.opacity -= 0.04;
        if (hm.opacity <= 0) {
          hitmarkers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 50, 50, ${hm.opacity})`;
        ctx.lineWidth = 1.8;
        const s = hm.size;

        ctx.beginPath();
        // X Hitmarker lines
        ctx.moveTo(hm.x - s, hm.y - s);
        ctx.lineTo(hm.x - s * 0.3, hm.y - s * 0.3);

        ctx.moveTo(hm.x + s, hm.y - s);
        ctx.lineTo(hm.x + s * 0.3, hm.y - s * 0.3);

        ctx.moveTo(hm.x - s, hm.y + s);
        ctx.lineTo(hm.x - s * 0.3, hm.y + s * 0.3);

        ctx.moveTo(hm.x + s, hm.y + s);
        ctx.lineTo(hm.x + s * 0.3, hm.y + s * 0.3);
        ctx.stroke();

        ctx.restore();
      }

      // --- LAYER 9: Tactical Gaming Scopes & Target Lock Scopes ---
      scopes.forEach((sc, idx) => {
        // Smooth wander target
        sc.angle += 0.01;
        sc.x += (sc.targetX - sc.x) * 0.02;
        sc.y += (sc.targetY - sc.y) * 0.02;

        if (Math.hypot(sc.targetX - sc.x, sc.targetY - sc.y) < 20) {
          sc.targetX = Math.random() * (width * 0.7) + width * 0.15;
          sc.targetY = Math.random() * (height * 0.7) + height * 0.15;
        }

        ctx.save();
        ctx.translate(sc.x, sc.y);

        if (sc.type === 'sniper') {
          // 8x Sniper Reticle (AWM / Kar98k Vibe)
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1.2;

          // Outer circle
          ctx.beginPath();
          ctx.arc(0, 0, sc.size, 0, Math.PI * 2);
          ctx.stroke();

          // Inner crosshairs
          ctx.beginPath();
          ctx.moveTo(-sc.size * 1.3, 0);
          ctx.lineTo(sc.size * 1.3, 0);
          ctx.moveTo(0, -sc.size * 1.3);
          ctx.lineTo(0, sc.size * 1.3);
          ctx.stroke();

          // Mil-dots
          ctx.fillStyle = '#EF4444';
          for (let d = -20; d <= 20; d += 10) {
            if (d !== 0) {
              ctx.beginPath();
              ctx.arc(d, 0, 1.2, 0, Math.PI * 2);
              ctx.arc(0, d, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Target lock text
          ctx.fillStyle = '#EF4444';
          ctx.font = '9px monospace';
          ctx.fillText(`[ LOCK: ${sc.label} ]`, sc.size + 8, 4);
        } else {
          // Holo Sight / Red Dot Vibe
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
          ctx.lineWidth = 1.5;

          // Ring
          ctx.beginPath();
          ctx.arc(0, 0, sc.size, 0, Math.PI * 2);
          ctx.stroke();

          // Center Red Dot
          ctx.fillStyle = '#FF3300';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();

          // Corner brackets
          const bSize = 8;
          ctx.strokeStyle = 'rgba(0, 255, 204, 0.6)';
          ctx.beginPath();
          ctx.moveTo(-sc.size - bSize, -sc.size);
          ctx.lineTo(-sc.size, -sc.size);
          ctx.lineTo(-sc.size, -sc.size - bSize);

          ctx.moveTo(sc.size + bSize, -sc.size);
          ctx.lineTo(sc.size, -sc.size);
          ctx.lineTo(sc.size, -sc.size - bSize);
          ctx.stroke();

          ctx.fillStyle = '#00FFCC';
          ctx.font = '9px monospace';
          ctx.fillText(`TARGET_SYS // ${sc.label}`, -sc.size, sc.size + 15);
        }

        ctx.restore();
      });

      // --- LAYER 10: Dark Horizon Edge Gradient for Contrast ---
      const edgeGrad = ctx.createLinearGradient(0, height - 90, 0, height);
      edgeGrad.addColorStop(0, 'rgba(8, 9, 13, 0)');
      edgeGrad.addColorStop(1, 'rgba(8, 9, 13, 0.95)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, height - 90, width, 90);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
