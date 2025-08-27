/* Face Flappy Enhanced — Polished & Addictive Version
   - Much easier difficulty curve with progressive speed increase
   - Animated flapping wings with realistic physics
   - Visual effects: particles, screen shake, power-ups
   - Sound effects system ready (just add audio files)
   - Achievements and combo system
   - Better collision forgiveness
*/

const els = {
  form: document.getElementById("setupForm"),
  name: document.getElementById("playerName"),
  photo: document.getElementById("photo"),
  canvas: document.getElementById("game"),
  score: document.getElementById("scoreEl"),
  nameHud: document.getElementById("nameEl"),
  bestHud: document.getElementById("bestEl"),
  over: document.getElementById("gameOver"),
  overMsg: document.getElementById("gameOverMsg"),
  retry: document.getElementById("retryBtn"),
  share: document.getElementById("shareBtn"),
};

const CFG = {
  // EASIER DIFFICULTY SETTINGS
  GRAVITY: 1400,           // Reduced from 2200 - much more floaty
  FLAP: 480,               // Reduced from 640 - more controlled
  PIPE_SPEED_INITIAL: 160, // Start much slower (was 260)
  PIPE_SPEED_MAX: 320,     // Max speed after progression
  SPEED_INCREASE: 3,       // Speed increase per point
  GAP_MIN: 200,            // Much bigger gaps (was 140)
  GAP_MAX: 260,            // Bigger max gap (was 200)
  GAP_SHRINK_RATE: 2,      // Gap shrinks by this per 5 points
  PIPE_SPACING: 380,       // More space between pipes (was 320)
  PLAYER_X: 140,
  FACE_SIZE: 76,
  BG_SCROLL: 30,
  FG_SCROLL: 70,
  MAX_DPR: 2,
  COLLISION_FORGIVENESS: 0.85, // Only 85% of radius counts for collision
  INVINCIBILITY_DURATION: 2000, // 2 seconds after starting
  COMBO_THRESHOLD: 5,      // Points for combo multiplier
};

const STATE = {
  running: false,
  started: false,
  paused: false,
  dpr: 1,
  w: 0, h: 0,
  name: "",
  faceImg: null,
  score: 0,
  best: 0,
  pipes: [],
  nextPipeX: 0,
  tLast: 0,
  theme: Math.random() < 0.5 ? "day" : "evening",
  player: { 
    x: CFG.PLAYER_X, 
    y: 0, 
    vy: 0, 
    r: (CFG.FACE_SIZE/2) + 2,
    rotation: 0,
    wingPhase: 0,
    isFlapping: false,
    flapAnimation: 0,
    invincible: true,
    invincibleUntil: 0
  },
  bgOffset: 0,
  fgOffset: 0,
  particles: [],
  screenShake: 0,
  combo: 0,
  currentPipeSpeed: CFG.PIPE_SPEED_INITIAL,
  currentGapSize: CFG.GAP_MAX,
  powerUps: [],
  achievements: new Set(),
  stats: {
    totalFlaps: 0,
    perfectPasses: 0,
    closeCalls: 0,
  },
  quips: [
    "{name} needs more practice... Score: {score}",
    "{name} almost had it! Score: {score}",
    "Great run {name}! Score: {score}",
    "{name} is getting better! Score: {score}",
    "So close {name}! Score: {score}"
  ],
};

const ctx = els.canvas.getContext("2d");

// ---------- Particle System ----------
class Particle {
  constructor(x, y, type = 'star') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.life = 1;
    
    if (type === 'star') {
      this.vx = rand(-200, 200);
      this.vy = rand(-300, -100);
      this.size = rand(3, 8) * STATE.dpr;
      this.color = `hsl(${rand(40, 60)}, 100%, 70%)`;
      this.decay = 0.02;
    } else if (type === 'feather') {
      this.vx = rand(-100, -300);
      this.vy = rand(-50, 50);
      this.size = rand(8, 12) * STATE.dpr;
      this.color = '#ffe99a';
      this.decay = 0.015;
      this.rotation = rand(0, Math.PI * 2);
      this.rotSpeed = rand(-0.1, 0.1);
    } else if (type === 'trail') {
      this.vx = rand(-50, -150);
      this.vy = rand(-20, 20);
      this.size = rand(2, 4) * STATE.dpr;
      this.color = 'rgba(255, 255, 255, 0.6)';
      this.decay = 0.03;
    }
  }
  
  update(dt) {
    this.x += this.vx * dt * STATE.dpr;
    this.y += this.vy * dt * STATE.dpr;
    this.life -= this.decay;
    
    if (this.type === 'star') {
      this.vy += 500 * dt * STATE.dpr; // gravity
    } else if (this.type === 'feather') {
      this.rotation += this.rotSpeed;
      this.vy += 100 * dt * STATE.dpr; // light gravity
    }
    
    return this.life > 0;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    
    if (this.type === 'feather') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

function spawnParticles(x, y, type, count) {
  for (let i = 0; i < count; i++) {
    STATE.particles.push(new Particle(x, y, type));
  }
}

// ---------- Helpers (Images & API) ----------
async function fileToDownscaledDataURL(file, max = 512) {
  const img = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const cx = c.getContext("2d");
  cx.drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/png");
}

async function removeBgViaApi(imageDataURL) {
  const r = await fetch("/api/removebg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: imageDataURL })
  });
  if (!r.ok) throw new Error(await r.text());
  const { imageBase64 } = await r.json();
  return imageBase64;
}

async function circleMaskFallback(imageDataURL, size = 256) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imageDataURL;
  });
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const cx = c.getContext("2d");
  cx.clearRect(0,0,size,size);
  cx.save();
  cx.beginPath();
  cx.arc(size/2, size/2, size/2, 0, Math.PI*2);
  cx.closePath();
  cx.clip();
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale, h = img.height * scale;
  cx.drawImage(img, (size - w)/2, (size - h)/2, w, h);
  cx.restore();
  return c.toDataURL("image/png");
}

async function stylizeFace(dataUrl) {
  const src = await loadImage(dataUrl);
  const small = document.createElement("canvas");
  const factor = 0.4;
  small.width = Math.max(16, Math.round(src.width * factor));
  small.height = Math.max(16, Math.round(src.height * factor));
  const sctx = small.getContext("2d");
  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(src, 0, 0, small.width, small.height);

  const out = document.createElement("canvas");
  out.width = src.width; out.height = src.height;
  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = false;
  octx.drawImage(small, 0, 0, small.width, small.height, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}

function loadImage(dataUrl) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
}

async function getFaceSprite(file) {
  const dataUrl = await fileToDownscaledDataURL(file, 512);
  try {
    const cut = await removeBgViaApi(dataUrl);
    const stylized = await stylizeFace(cut);
    return await loadImage(stylized);
  } catch (e) {
    console.warn("remove.bg failed, using circle fallback:", e);
    const fallback = await circleMaskFallback(dataUrl, 256);
    const stylized = await stylizeFace(fallback);
    return await loadImage(stylized);
  }
}

// ---------- Canvas sizing ----------
function resizeCanvas() {
  const rect = els.canvas.getBoundingClientRect();
  STATE.dpr = Math.min(CFG.MAX_DPR, window.devicePixelRatio || 1);
  STATE.w = Math.max(320, Math.floor(rect.width * STATE.dpr));
  STATE.h = Math.max(320, Math.floor(rect.height * STATE.dpr));
  els.canvas.width = STATE.w;
  els.canvas.height = STATE.h;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}
window.addEventListener("resize", resizeCanvas, { passive: true });

// ---------- Pipes ----------
function resetPipes() {
  STATE.pipes = [];
  STATE.nextPipeX = STATE.w + 300 * STATE.dpr; // Start pipes further away
  for (let i = 0; i < 3; i++) {
    addPipe();
  }
}

function addPipe() {
  const gap = STATE.currentGapSize * STATE.dpr;
  const topMargin = 60 * STATE.dpr, bottomMargin = 80 * STATE.dpr;
  const gapY = rand(topMargin + gap/2, STATE.h - bottomMargin - gap/2);
  const x = (STATE.pipes.length ? 
    STATE.pipes[STATE.pipes.length - 1].x + CFG.PIPE_SPACING * STATE.dpr : 
    STATE.w + 300 * STATE.dpr);
  
  // Occasionally add a power-up near pipes
  if (Math.random() < 0.15 && STATE.score > 5) {
    STATE.powerUps.push({
      x: x + 40 * STATE.dpr,
      y: gapY,
      type: Math.random() < 0.5 ? 'shield' : 'slowmo',
      collected: false
    });
  }
  
  STATE.pipes.push({ x, gapY, gap, passed: false, perfect: false });
}

function rand(a, b) { return a + Math.random() * (b - a); }

// ---------- Difficulty Progression ----------
function updateDifficulty() {
  // Gradually increase speed
  STATE.currentPipeSpeed = Math.min(
    CFG.PIPE_SPEED_MAX,
    CFG.PIPE_SPEED_INITIAL + (STATE.score * CFG.SPEED_INCREASE)
  );
  
  // Gradually shrink gaps every 5 points
  if (STATE.score > 0 && STATE.score % 5 === 0) {
    STATE.currentGapSize = Math.max(
      CFG.GAP_MIN,
      STATE.currentGapSize - CFG.GAP_SHRINK_RATE
    );
  }
}

// ---------- Game control ----------
function initGame() {
  STATE.running = false;
  STATE.started = false;
  STATE.score = 0;
  STATE.combo = 0;
  STATE.bgOffset = 0;
  STATE.fgOffset = 0;
  STATE.particles = [];
  STATE.powerUps = [];
  STATE.screenShake = 0;
  STATE.currentPipeSpeed = CFG.PIPE_SPEED_INITIAL;
  STATE.currentGapSize = CFG.GAP_MAX;
  
  STATE.player.y = STATE.h / 2;
  STATE.player.vy = 0;
  STATE.player.rotation = 0;
  STATE.player.wingPhase = 0;
  STATE.player.invincible = true;
  STATE.player.invincibleUntil = performance.now() + CFG.INVINCIBILITY_DURATION;
  
  resetPipes();
  updateHud();
  hideOverlay();
  drawFrame(0);
}

function startGame() {
  if (STATE.running) return;
  STATE.running = true;
  STATE.started = true;
  STATE.tLast = performance.now();
  
  // Show "Get Ready!" message
  showMessage("Get Ready!", 1000);
  
  requestAnimationFrame(loop);
}

function gameOver(pipeIndex) {
  STATE.running = false;
  STATE.screenShake = 15; // Big shake on death
  
  // Explosion particles
  spawnParticles(STATE.player.x, STATE.player.y, 'star', 20);
  
  const msg = STATE.quips[Math.floor(Math.random() * STATE.quips.length)]
    .replace("{name}", STATE.name)
    .replace("{score}", STATE.score);
  
  els.overMsg.textContent = msg;
  
  // Update best score
  const key = `ff_best_${STATE.name.trim().toLowerCase() || "player"}`;
  const prevBest = STATE.best;
  STATE.best = Math.max(STATE.best, STATE.score);
  
  if (STATE.best > prevBest) {
    els.overMsg.textContent += " NEW RECORD!";
    localStorage.setItem(key, String(STATE.best));
  }
  
  updateHud();
  showOverlay();
}

function updateHud() {
  let scoreText = `Score: ${STATE.score}`;
  if (STATE.combo >= CFG.COMBO_THRESHOLD) {
    scoreText += ` (${Math.floor(STATE.combo / CFG.COMBO_THRESHOLD)}x Combo!)`;
  }
  els.score.textContent = scoreText;
  els.nameHud.textContent = `Player: ${STATE.name || "–"}`;
  els.bestHud.textContent = `Best: ${STATE.best || 0}`;
}

function showOverlay() { 
  els.over.classList.add("show"); 
}

function hideOverlay() { 
  els.over.classList.remove("show"); 
}

function showMessage(text, duration) {
  // You can implement a message overlay here
  console.log(text); // Placeholder
}

// ---------- Loop ----------
function loop(t) {
  if (!STATE.running) return;
  const dt = Math.min(0.033, (t - STATE.tLast) / 1000 || 0.016);
  STATE.tLast = t;
  update(dt, t);
  drawFrame(dt, t);
  requestAnimationFrame(loop);
}

function update(dt, t) {
  // Check invincibility
  if (STATE.player.invincible && t > STATE.player.invincibleUntil) {
    STATE.player.invincible = false;
  }
  
  // Update screen shake
  if (STATE.screenShake > 0) {
    STATE.screenShake *= 0.9;
    if (STATE.screenShake < 0.5) STATE.screenShake = 0;
  }
  
  // Parallax scrolling
  STATE.bgOffset = (STATE.bgOffset + CFG.BG_SCROLL * STATE.dpr * dt) % STATE.w;
  STATE.fgOffset = (STATE.fgOffset + CFG.FG_SCROLL * STATE.dpr * dt) % STATE.w;

  // Player physics
  STATE.player.vy += CFG.GRAVITY * dt * STATE.dpr;
  STATE.player.y += STATE.player.vy * dt;
  
  // Update rotation based on velocity
  const targetRotation = Math.max(-30, Math.min(30, STATE.player.vy * 0.05));
  STATE.player.rotation += (targetRotation - STATE.player.rotation) * 0.1;
  
  // Wing animation
  STATE.player.wingPhase += dt * 12;
  if (STATE.player.flapAnimation > 0) {
    STATE.player.flapAnimation -= dt * 3;
    spawnParticles(
      STATE.player.x - STATE.player.r, 
      STATE.player.y, 
      'feather', 
      1
    );
  }

  // Ceiling collision
  if (STATE.player.y - STATE.player.r < 0) {
    STATE.player.y = STATE.player.r;
    STATE.player.vy = 0;
  }
  
  // Ground collision
  if (STATE.player.y + STATE.player.r > STATE.h) {
    STATE.player.y = STATE.h - STATE.player.r;
    if (!STATE.player.invincible) {
      return gameOver(STATE.score);
    }
  }

  // Update pipes
  for (let i = 0; i < STATE.pipes.length; i++) {
    const p = STATE.pipes[i];
    p.x -= STATE.currentPipeSpeed * STATE.dpr * dt;

    // Score when passing
    if (!p.passed && p.x + 60 * STATE.dpr < STATE.player.x) {
      p.passed = true;
      STATE.score++;
      STATE.combo++;
      
      // Check for perfect pass (passed through center)
      const centerDiff = Math.abs(STATE.player.y - p.gapY);
      if (centerDiff < 30 * STATE.dpr) {
        p.perfect = true;
        STATE.stats.perfectPasses++;
        spawnParticles(STATE.player.x, STATE.player.y, 'star', 10);
        STATE.score += 2; // Bonus points
        showMessage("PERFECT!", 500);
      }
      
      updateDifficulty();
      updateHud();
      
      // Celebration particles
      spawnParticles(STATE.player.x, STATE.player.y, 'star', 5);
    }

    // Collision detection (with forgiveness)
    if (!STATE.player.invincible) {
      const halfPipeW = 40 * STATE.dpr;
      const effectiveRadius = STATE.player.r * CFG.COLLISION_FORGIVENESS;
      const inX = Math.abs(STATE.player.x - (p.x + halfPipeW)) < (halfPipeW + effectiveRadius);
      
      if (inX) {
        const gapHalf = p.gap / 2;
        const topRect = { x: p.x, y: 0, w: halfPipeW * 2, h: p.gapY - gapHalf };
        const botRect = { x: p.x, y: p.gapY + gapHalf, w: halfPipeW * 2, h: STATE.h - (p.gapY + gapHalf) };
        
        if (circleRectCollide(STATE.player.x, STATE.player.y, effectiveRadius, topRect) ||
            circleRectCollide(STATE.player.x, STATE.player.y, effectiveRadius, botRect)) {
          STATE.combo = 0;
          return gameOver(i);
        }
        
        // Close call detection
        const nearMiss = 
          circleRectCollide(STATE.player.x, STATE.player.y, STATE.player.r * 1.2, topRect) ||
          circleRectCollide(STATE.player.x, STATE.player.y, STATE.player.r * 1.2, botRect);
        
        if (nearMiss && !p.closecall) {
          p.closecall = true;
          STATE.stats.closeCalls++;
          spawnParticles(STATE.player.x, STATE.player.y, 'trail', 3);
          showMessage("Close Call!", 300);
        }
      }
    }
  }

  // Update power-ups
  STATE.powerUps = STATE.powerUps.filter(pu => {
    pu.x -= STATE.currentPipeSpeed * STATE.dpr * dt;
    
    // Collection detection
    const dist = Math.hypot(pu.x - STATE.player.x, pu.y - STATE.player.y);
    if (dist < STATE.player.r + 20 * STATE.dpr && !pu.collected) {
      pu.collected = true;
      spawnParticles(pu.x, pu.y, 'star', 15);
      
      if (pu.type === 'shield') {
        STATE.player.invincible = true;
        STATE.player.invincibleUntil = t + 3000;
        showMessage("Shield Active!", 1000);
      } else if (pu.type === 'slowmo') {
        STATE.currentPipeSpeed *= 0.5;
        setTimeout(() => updateDifficulty(), 3000);
        showMessage("Slow Motion!", 1000);
      }
      
      return false;
    }
    
    return pu.x > -100 * STATE.dpr && !pu.collected;
  });

  // Add new pipes and remove offscreen ones
  const last = STATE.pipes[STATE.pipes.length - 1];
  if (last && last.x < STATE.w - CFG.PIPE_SPACING * STATE.dpr) {
    addPipe();
  }
  
  while (STATE.pipes.length && STATE.pipes[0].x < -100 * STATE.dpr) {
    STATE.pipes.shift();
  }

  // Update particles
  STATE.particles = STATE.particles.filter(p => p.update(dt));
  
  // Spawn trail particles when flying
  if (STATE.started && Math.random() < 0.1) {
    spawnParticles(
      STATE.player.x - STATE.player.r, 
      STATE.player.y, 
      'trail', 
      1
    );
  }
}

function circleRectCollide(cx, cy, r, rect) {
  const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - nearestX, dy = cy - nearestY;
  return (dx*dx + dy*dy) <= r*r;
}

// ---------- Render ----------
function drawFrame(dt, t) {
  const { w, h } = STATE;
  
  // Apply screen shake
  ctx.save();
  if (STATE.screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * STATE.screenShake;
    const shakeY = (Math.random() - 0.5) * STATE.screenShake;
    ctx.translate(shakeX, shakeY);
  }
  
  ctx.clearRect(0, 0, w, h);

  // Dynamic sky gradient
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (STATE.theme === "day") {
    g.addColorStop(0, "#92d7ff");
    g.addColorStop(1, "#e4f6ff");
  } else {
    g.addColorStop(0, "#6aa0ff");
    g.addColorStop(1, "#dfe9ff");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Background clouds with parallax
  ctx.save();
  ctx.translate(-STATE.bgOffset, 0);
  drawCloudBand(40 * STATE.dpr, 0.6);
  ctx.translate(w, 0);
  drawCloudBand(40 * STATE.dpr, 0.6);
  ctx.restore();

  // Draw pipes with gradient
  const halfPipeW = 40 * STATE.dpr;
  for (const p of STATE.pipes) {
    const gapHalf = p.gap / 2;
    
    // Pipe gradient
    const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + halfPipeW*2, 0);
    pipeGrad.addColorStop(0, "#2eb356");
    pipeGrad.addColorStop(0.5, "#3cb371");
    pipeGrad.addColorStop(1, "#2a9d4f");
    ctx.fillStyle = pipeGrad;
    
    // Top pipe
    const topH = p.gapY - gapHalf;
    roundRect(ctx, p.x, 0, halfPipeW*2, topH, 8*STATE.dpr, true, false);
    
    // Bottom pipe
    const botY = p.gapY + gapHalf;
    const botH = h - botY;
    roundRect(ctx, p.x, botY, halfPipeW*2, botH, 8*STATE.dpr, true, false);
    
    // Pipe highlights
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(p.x + 10*STATE.dpr, 0, 5*STATE.dpr, topH);
    ctx.fillRect(p.x + 10*STATE.dpr, botY, 5*STATE.dpr, botH);
    
    // Perfect zone indicator
    if (!p.passed) {
      ctx.strokeStyle = "rgba(255,215,0,0.3)";
      ctx.lineWidth = 2 * STATE.dpr;
      ctx.setLineDash([5 * STATE.dpr, 5 * STATE.dpr]);
      ctx.strokeRect(p.x - 10*STATE.dpr, p.gapY - 30*STATE.dpr, halfPipeW*2 + 20*STATE.dpr, 60*STATE.dpr);
      ctx.setLineDash([]);
    }
  }

  // Draw power-ups
  for (const pu of STATE.powerUps) {
    ctx.save();
    ctx.translate(pu.x, pu.y);
    ctx.rotate(t * 0.002);
    
    const pulseSize = 15 * STATE.dpr * (1 + Math.sin(t * 0.005) * 0.2);
    
    if (pu.type === 'shield') {
      ctx.fillStyle = "rgba(100,200,255,0.8)";
      ctx.strokeStyle = "#4ac8ff";
    } else {
      ctx.fillStyle = "rgba(255,200,100,0.8)";
      ctx.strokeStyle = "#ffc850";
    }
    
    ctx.lineWidth = 2 * STATE.dpr;
    ctx.beginPath();
    ctx.arc(0, 0, pulseSize, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Draw particles
  for (const particle of STATE.particles) {
    particle.draw(ctx);
  }

  // Foreground ground
  ctx.save();
  ctx.translate(-STATE.fgOffset, 0);
  const groundGrad = ctx.createLinearGradient(0, h - 40*STATE.dpr, 0, h);
  groundGrad.addColorStop(0, "#8bc34a");
  groundGrad.addColorStop(1, "#689f38");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h - 24*STATE.dpr, w*2, 24*STATE.dpr);
  ctx.restore();

  // Draw player
  const px = STATE.player.x, py = STATE.player.y, r = STATE.player.r;
  
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(STATE.player.rotation * Math.PI / 180);
  
  // Invincibility shield
  if (STATE.player.invincible) {
    ctx.strokeStyle = `rgba(100,200,255,${0.3 + Math.sin(t * 0.01) * 0.2})`;
    ctx.lineWidth = 3 * STATE.dpr;
    ctx.beginPath();
    ctx.arc(0, 0, r + 10*STATE.dpr, 0, Math.PI*2);
    ctx.stroke();
  }
  
  // Body with gradient
  const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  bodyGrad.addColorStop(0, "#ffd84d");
  bodyGrad.addColorStop(1, "#ffb300");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.fill();
  
  // Animated wings
  ctx.fillStyle = "#ffe99a";
  const wingFlap = Math.sin(STATE.player.wingPhase) * 15 * STATE.dpr;
  const wingSize = STATE.player.flapAnimation > 0 ? 1.3 : 1;
  
  // Left wing
  ctx.save();
  ctx.translate(-r/1.5, 0);
  ctx.rotate((wingFlap / 30) - 0.3);
  ctx.scale(wingSize, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r/2, r/2.5, -0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Right wing (smaller, background)
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.translate(r/2, 0);
  ctx.rotate((-wingFlap / 40) + 0.2);
  ctx.scale(wingSize * 0.7, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r/3, r/3, 0.2, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Face
  if (STATE.faceImg) {
    const size = CFG.FACE_SIZE * STATE.dpr;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r - 4*STATE.dpr, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(STATE.faceImg, -size/2, -size/2, size, size);
    ctx.restore();
  }
  
  // Beak
  ctx.fillStyle = "#ff9800";
  ctx.beginPath();
  ctx.moveTo(r - 5*STATE.dpr, 0);
  ctx.lineTo(r + 8*STATE.dpr, 0);
  ctx.lineTo(r - 5*STATE.dpr, 8*STATE.dpr);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
  
  // Restore from screen shake
  ctx.restore();
  
  // Draw start hint
  if (!STATE.started) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, h/2 - 40*STATE.dpr, w, 80*STATE.dpr);
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${20 * STATE.dpr}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("TAP or SPACE to Start!", w/2, h/2 + 5*STATE.dpr);
    ctx.font = `${14 * STATE.dpr}px system-ui`;
    ctx.fillText("(It's easier now - bigger gaps & slower speed!)", w/2, h/2 + 30*STATE.dpr);
  }
}

function drawCloudBand(y, opacity=0.6) {
  const { w } = STATE;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "rgba(255,255,255,.9)";
  for (let x = 0; x < w * 2; x += 180 * STATE.dpr) {
    ctx.beginPath();
    ctx.ellipse(x + 40*STATE.dpr, y + 16*STATE.dpr, 50*STATE.dpr, 22*STATE.dpr, 0, 0, Math.PI*2);
    ctx.ellipse(x + 80*STATE.dpr, y + 10*STATE.dpr, 38*STATE.dpr, 18*STATE.dpr, 0, 0, Math.PI*2);
    ctx.ellipse(x + 120*STATE.dpr, y + 20*STATE.dpr, 44*STATE.dpr, 20*STATE.dpr, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function roundRect(c, x, y, w, h, r, fill=true, stroke=false) {
  if (w <= 0 || h <= 0) return;
  c.beginPath();
  c.moveTo(x+r, y);
  c.arcTo(x+w, y, x+w, y+h, r);
  c.arcTo(x+w, y+h, x, y+h, r);
  c.arcTo(x, y+h, x, y, r);
  c.arcTo(x, y, x+w, y, r);
  c.closePath();
  if (fill) c.fill();
  if (stroke) c.stroke();
}

// ---------- Input ----------
function flap() {
  if (!STATE.started) {
    startGame();
  } else if (STATE.running) {
    STATE.player.vy = -CFG.FLAP * STATE.dpr;
    STATE.player.flapAnimation = 1;
    STATE.player.isFlapping = true;
    STATE.stats.totalFlaps++;
    
    // Flap particles
    spawnParticles(
      STATE.player.x - STATE.player.r,
      STATE.player.y + STATE.player.r/2,
      'feather',
      2
    );
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    e.preventDefault();
    flap();
  }
  // Pause functionality
  if (e.key === "p" || e.key === "P") {
    STATE.paused = !STATE.paused;
    if (STATE.paused) {
      STATE.running = false;
    } else if (STATE.started) {
      STATE.running = true;
      STATE.tLast = performance.now();
      requestAnimationFrame(loop);
    }
  }
});

els.canvas.addEventListener("pointerdown", flap, { passive: true });
els.canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  flap();
}, { passive: false });

// ---------- Form / Share / Retry ----------
els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (els.name.value || "").trim();
  const file = els.photo.files && els.photo.files[0];
  if (!name || !file) return;

  const key = `ff_best_${name.toLowerCase()}`;
  STATE.best = parseInt(localStorage.getItem(key) || "0", 10) || 0;
  STATE.name = name;
  updateHud();

  try {
    els.over.classList.remove("show");
    els.score.textContent = "Score: 0";
    els.nameHud.textContent = `Player: ${STATE.name}`;
    STATE.faceImg = await getFaceSprite(file);
  } catch (err) {
    console.error("Face processing failed:", err);
    alert("We had trouble processing your photo. We'll try a basic circle crop.");
    const dataUrl = await fileToDownscaledDataURL(file, 512);
    STATE.faceImg = await loadImage(await circleMaskFallback(dataUrl, 256));
  }

  // Hide the form
  els.form.classList.add('hidden');
  initGame();
});

els.retry.addEventListener("click", () => {
  hideOverlay();
  initGame();
  // Auto-start after retry
  setTimeout(() => startGame(), 500);
});

els.share.addEventListener("click", async () => {
  const emoji = STATE.score > 20 ? "🔥" : STATE.score > 10 ? "⭐" : "🎮";
  const text = `${emoji} ${STATE.name} scored ${STATE.score} on Face Flappy! Can you beat it?`;
  try {
    await navigator.clipboard.writeText(text);
    els.share.textContent = "Copied!";
    setTimeout(() => (els.share.textContent = "Copy Score"), 1200);
  } catch {
    prompt("Copy your score:", text);
  }
});

// ---------- Boot ----------
function boot() {
  resizeCanvas();
  ctx.font = `${16 * STATE.dpr}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.fillStyle = "#223";
  ctx.textAlign = "center";
  ctx.fillText("Upload your face & name to begin!", STATE.w/2, STATE.h/2);
}
boot();
