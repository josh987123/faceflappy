/* Face Flappy ULTIMATE Edition - Super Polished & Addictive
   - Complete achievement system with 30+ unlockables
   - Power-ups, skins, daily challenges, and more!
   - Sound system ready (add your own audio files)
   - Leaderboards, streaks, and progression system
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
  // BALANCED DIFFICULTY - Fun but challenging
  GRAVITY: 800,
  FLAP: 350,
  PIPE_SPEED_INITIAL: 100,
  PIPE_SPEED_MAX: 200,
  SPEED_INCREASE: 1,
  GAP_MIN: 250,
  GAP_MAX: 350,
  GAP_SHRINK_RATE: 1,
  PIPE_SPACING: 500,
  PLAYER_X: 140,
  FACE_SIZE: 76,
  WING_SIZE: 1.5,  // Increased from default
  BEAK_SIZE: 1.4,  // Increased from default
  HORN_SIZE: 1.3,  // For unicorn
  EAR_SIZE: 1.2,   // For cat
  BG_SCROLL: 30,
  FG_SCROLL: 70,
  MAX_DPR: 2,
  COLLISION_FORGIVENESS: 0.7,
  HOVER_TIME: 0.15,
  START_PIPES_DELAY: 400,
  
  // Power-up durations
  POWERUP_MAGNET_DURATION: 3000,
  POWERUP_SHRINK_DURATION: 5000,
  POWERUP_DOUBLE_DURATION: 5, // Number of pipes
  POWERUP_GHOST_DURATION: 2000,
  POWERUP_SLOWMO_DURATION: 4000,
  POWERUP_BALLOON_DURATION: 6000,
  POWERUP_SPAWN_CHANCE: 0.15,
};

// Bird Skins System
const SKINS = {
  classic: { 
    name: "Classic", 
    body: "#ffd84d", 
    wing: "#ffe99a",
    unlock: 0,
    description: "The original flapper"
  },
  chrome: { 
    name: "Chrome", 
    body: "linear-gradient(45deg, #c0c0c0, #ffffff, #c0c0c0)",
    wing: "#e0e0e0",
    unlock: 10,
    description: "Shiny and chrome! (10 points)"
  },
  flame: { 
    name: "Flame", 
    body: "linear-gradient(45deg, #ff6b6b, #ffd93d)",
    wing: "#ff9500",
    unlock: 25,
    particle: 'flame',
    description: "On fire! (25 points)"
  },
  galaxy: { 
    name: "Galaxy", 
    body: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
    wing: "#a855f7",
    unlock: 50,
    particle: 'sparkle',
    description: "Cosmic powers (50 points)"
  },
  rainbow: { 
    name: "Rainbow", 
    body: "linear-gradient(45deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8)",
    wing: "#ff69b4",
    unlock: 100,
    particle: 'rainbow',
    trail: true,
    description: "Legendary! (100 points)"
  },
  ghost: { 
    name: "Ghost", 
    body: "rgba(255,255,255,0.4)",
    wing: "rgba(255,255,255,0.3)",
    unlock: 150,
    special: 'phase',
    description: "Ethereal form (150 points)"
  },
  golden: { 
    name: "Golden", 
    body: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
    wing: "#fff700",
    unlock: 200,
    particle: 'gold',
    description: "Pure gold! (200 points)"
  },
  matrix: { 
    name: "Matrix", 
    body: "linear-gradient(45deg, #00ff00, #003300)",
    wing: "#00ff00",
    unlock: 'dailyStreak7',
    special: 'digital',
    description: "7-day streak reward!"
  },
  ninja: { 
    name: "Ninja", 
    body: "#1a1a1a",
    wing: "#333333",
    unlock: 'perfectRun10',
    special: 'shadow',
    description: "10 perfect passes in one run"
  }
};

// Achievements System
const ACHIEVEMENTS = {
  firstFlight: { name: "First Flight", desc: "Play your first game", icon: "🛫", points: 10 },
  scorer: { name: "Scorer", desc: "Score 10 points", icon: "📊", points: 20 },
  highFlyer: { name: "High Flyer", desc: "Score 25 points", icon: "🦅", points: 50 },
  elite: { name: "Elite", desc: "Score 50 points", icon: "⭐", points: 100 },
  legend: { name: "Legend", desc: "Score 100 points", icon: "👑", points: 200 },
  perfectTiming: { name: "Perfect Timing", desc: "Get 5 perfect passes", icon: "🎯", points: 30 },
  closeCall: { name: "Daredevil", desc: "Get 10 close calls", icon: "😰", points: 40 },
  comboMaster: { name: "Combo Master", desc: "Get a 10x combo", icon: "🔥", points: 60 },
  powerUser: { name: "Power User", desc: "Collect 20 power-ups", icon: "💪", points: 50 },
  survivor: { name: "Survivor", desc: "Play for 60 seconds", icon: "⏱️", points: 70 },
  noFlap: { name: "Glider", desc: "Pass 3 pipes without flapping", icon: "🪂", points: 100 },
  speedDemon: { name: "Speed Demon", desc: "Score 20 at max speed", icon: "💨", points: 150 },
  earlyBird: { name: "Early Bird", desc: "Play before 6 AM", icon: "🌅", points: 30 },
  nightOwl: { name: "Night Owl", desc: "Play after midnight", icon: "🦉", points: 30 },
  dedicated: { name: "Dedicated", desc: "Play 100 total games", icon: "💯", points: 100 },
  millionaire: { name: "Millionaire", desc: "Score 1000 total points", icon: "💰", points: 200 },
  socialite: { name: "Socialite", desc: "Share your score 10 times", icon: "📢", points: 40 },
  photographer: { name: "Photographer", desc: "Try 5 different faces", icon: "📸", points: 50 },
  persistent: { name: "Persistent", desc: "Retry 50 times", icon: "🔄", points: 60 },
  zen: { name: "Zen Master", desc: "Reach a 7-day streak", icon: "🧘", points: 150 },
  addict: { name: "Addicted", desc: "Play 10 games in one session", icon: "🎮", points: 80 },
  pacifist: { name: "Pacifist", desc: "Score 10 without power-ups", icon: "☮️", points: 90 },
  collector: { name: "Collector", desc: "Unlock 5 skins", icon: "🎨", points: 120 },
  completionist: { name: "Completionist", desc: "Unlock all achievements", icon: "🏆", points: 500 },
};

// Daily Challenges
const DAILY_CHALLENGES = [
  { id: 'noTop', name: "Sky's the Limit", desc: "Score 15 without hitting top pipes", reward: 50 },
  { id: 'noBottom', name: "Ground Control", desc: "Score 15 without hitting bottom pipes", reward: 50 },
  { id: 'perfect10', name: "Perfectionist", desc: "Get 10 perfect passes", reward: 75 },
  { id: 'speedRun', name: "Speed Runner", desc: "Score 30 in under 60 seconds", reward: 100 },
  { id: 'pacifist', name: "Natural Talent", desc: "Score 20 without power-ups", reward: 80 },
  { id: 'combo20', name: "Combo King", desc: "Reach a 20x combo", reward: 120 },
  { id: 'oneLife', name: "One Shot", desc: "Score 40 in your first attempt", reward: 150 },
  { id: 'lowFlap', name: "Efficiency Expert", desc: "Score 10 with less than 15 flaps", reward: 90 },
  { id: 'highFlap', name: "Flap Happy", desc: "Score 10 with more than 50 flaps", reward: 60 },
  { id: 'survivor', name: "Survivor", desc: "Stay alive for 90 seconds", reward: 110 },
];

// Enhanced State
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
  gameStartTime: 0,
  theme: Math.random() < 0.5 ? "day" : "evening",
  
  // Enhanced player state
  player: { 
    x: CFG.PLAYER_X, 
    y: 0, 
    vy: 0, 
    r: (CFG.FACE_SIZE/2) + 2,
    rotation: 0,
    wingPhase: 0,
    wingFlapPower: 0,
    hoverTime: 0,
    skin: 'classic',
    trail: [],
    character: 'bird', // bird, unicorn, or cat
  },
  
  // Power-up states
  powerups: {
    active: [],
    magnet: false,
    magnetUntil: 0,
    shrink: false,
    shrinkUntil: 0,
    double: false,
    doublePipes: 0,
    ghost: false,
    ghostUntil: 0,
    slowmo: false,
    slowmoUntil: 0,
    balloon: false,
    balloonUntil: 0,
  },
  
  // Visual effects
  bgOffset: 0,
  fgOffset: 0,
  particles: [],
  screenShake: 0,
  flashEffect: 0,
  
  // Progression
  combo: 0,
  maxCombo: 0,
  currentPipeSpeed: CFG.PIPE_SPEED_INITIAL,
  currentGapSize: CFG.GAP_MAX,
  
  // Statistics
  stats: {
    totalGames: 0,
    totalScore: 0,
    totalFlaps: 0,
    totalTime: 0,
    perfectPasses: 0,
    closeCalls: 0,
    powerupsCollected: 0,
    shareCount: 0,
    retryCount: 0,
    dailyStreak: 0,
    lastPlayDate: null,
    unlockedSkins: ['classic'],
    unlockedAchievements: [],
    achievementPoints: 0,
    currentChallenge: null,
    challengeProgress: {},
    leaderboard: [],
  },
  
  // Messages
  messages: [],
  
  quips: [
    "{name} scored {score}! Getting better!",
    "Nice run, {name}! Score: {score}",
    "{name} is learning to fly! Score: {score}",
    "Keep practicing, {name}! Score: {score}",
    "Great job, {name}! Score: {score}",
    "Wow {name}! Score: {score}! You're improving!",
    "{name} is on fire! Score: {score}!",
  ],
};

let ctx = null; // Will be initialized later

// ---------- Achievement & Unlock System ----------
function checkAchievements() {
  const a = STATE.stats;
  
  // Check various achievements
  if (!a.unlockedAchievements.includes('firstFlight') && a.totalGames >= 1) {
    unlockAchievement('firstFlight');
  }
  if (!a.unlockedAchievements.includes('scorer') && STATE.score >= 10) {
    unlockAchievement('scorer');
  }
  if (!a.unlockedAchievements.includes('highFlyer') && STATE.score >= 25) {
    unlockAchievement('highFlyer');
  }
  if (!a.unlockedAchievements.includes('elite') && STATE.score >= 50) {
    unlockAchievement('elite');
  }
  if (!a.unlockedAchievements.includes('legend') && STATE.score >= 100) {
    unlockAchievement('legend');
  }
  if (!a.unlockedAchievements.includes('perfectTiming') && a.perfectPasses >= 5) {
    unlockAchievement('perfectTiming');
  }
  if (!a.unlockedAchievements.includes('comboMaster') && STATE.combo >= 10) {
    unlockAchievement('comboMaster');
  }
  if (!a.unlockedAchievements.includes('dedicated') && a.totalGames >= 100) {
    unlockAchievement('dedicated');
  }
  if (!a.unlockedAchievements.includes('millionaire') && a.totalScore >= 1000) {
    unlockAchievement('millionaire');
  }
  
  // Check time-based achievements
  const hour = new Date().getHours();
  if (!a.unlockedAchievements.includes('earlyBird') && hour < 6) {
    unlockAchievement('earlyBird');
  }
  if (!a.unlockedAchievements.includes('nightOwl') && hour >= 0 && hour < 5) {
    unlockAchievement('nightOwl');
  }
  
  // Check daily streak
  const today = new Date().toDateString();
  if (a.lastPlayDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (a.lastPlayDate === yesterday) {
      a.dailyStreak++;
      showMessage(`🔥 ${a.dailyStreak} Day Streak!`, 2000, 'gold');
    } else {
      a.dailyStreak = 1;
    }
    a.lastPlayDate = today;
    
    // Pick daily challenge
    const challengeIndex = new Date().getDate() % DAILY_CHALLENGES.length;
    STATE.stats.currentChallenge = DAILY_CHALLENGES[challengeIndex];
    showMessage(`Today's Challenge: ${STATE.stats.currentChallenge.name}`, 3000);
  }
  
  if (!a.unlockedAchievements.includes('zen') && a.dailyStreak >= 7) {
    unlockAchievement('zen');
  }
  
  // Check and unlock skins
  checkSkinUnlocks();
  
  saveStats();
}

function unlockAchievement(id) {
  if (STATE.stats.unlockedAchievements.includes(id)) return;
  
  STATE.stats.unlockedAchievements.push(id);
  STATE.stats.achievementPoints += ACHIEVEMENTS[id].points;
  
  showMessage(
    `🏆 Achievement: ${ACHIEVEMENTS[id].name}! (+${ACHIEVEMENTS[id].points} pts)`, 
    3000, 
    'achievement'
  );
  
  // Special effects
  STATE.flashEffect = 1;
  spawnParticles(STATE.w/2, STATE.h/2, 'achievement', 30);
  
  saveStats();
}

function checkSkinUnlocks() {
  for (const [key, skin] of Object.entries(SKINS)) {
    if (STATE.stats.unlockedSkins.includes(key)) continue;
    
    if (typeof skin.unlock === 'number' && STATE.best >= skin.unlock) {
      STATE.stats.unlockedSkins.push(key);
      showMessage(`🎨 New Skin Unlocked: ${skin.name}!`, 3000, 'skin');
    } else if (skin.unlock === 'dailyStreak7' && STATE.stats.dailyStreak >= 7) {
      STATE.stats.unlockedSkins.push(key);
      showMessage(`🎨 Streak Reward: ${skin.name} Skin!`, 3000, 'skin');
    } else if (skin.unlock === 'perfectRun10' && STATE.stats.perfectPasses >= 10) {
      STATE.stats.unlockedSkins.push(key);
      showMessage(`🎨 Perfect Reward: ${skin.name} Skin!`, 3000, 'skin');
    }
  }
}

// ---------- Enhanced Particle System ----------
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
    } else if (type === 'achievement') {
      this.vx = rand(-300, 300);
      this.vy = rand(-400, -200);
      this.size = rand(4, 10) * STATE.dpr;
      this.color = '#ffd700';
      this.decay = 0.015;
    } else if (type === 'flame') {
      this.vx = rand(-50, -200);
      this.vy = rand(-100, 100);
      this.size = rand(4, 8) * STATE.dpr;
      this.color = `hsl(${rand(0, 60)}, 100%, 50%)`;
      this.decay = 0.025;
    } else if (type === 'sparkle') {
      this.vx = rand(-150, 150);
      this.vy = rand(-150, 150);
      this.size = rand(2, 6) * STATE.dpr;
      this.color = `hsl(${rand(250, 290)}, 100%, 70%)`;
      this.decay = 0.02;
      this.twinkle = Math.random();
    } else if (type === 'rainbow') {
      this.vx = rand(-100, -250);
      this.vy = rand(-50, 50);
      this.size = rand(3, 7) * STATE.dpr;
      this.hue = rand(0, 360);
      this.decay = 0.018;
    } else if (type === 'gold') {
      this.vx = rand(-150, 150);
      this.vy = rand(-200, -50);
      this.size = rand(3, 8) * STATE.dpr;
      this.color = '#ffd700';
      this.decay = 0.015;
      this.sparkle = Math.random();
    }
  }
  
  update(dt) {
    this.x += this.vx * dt * STATE.dpr;
    this.y += this.vy * dt * STATE.dpr;
    this.life -= this.decay;
    
    if (this.type === 'star' || this.type === 'achievement' || this.type === 'gold') {
      this.vy += 500 * dt * STATE.dpr;
    } else if (this.type === 'feather') {
      this.rotation += this.rotSpeed;
      this.vy += 100 * dt * STATE.dpr;
    } else if (this.type === 'flame') {
      this.vy -= 200 * dt * STATE.dpr; // Fire rises
    } else if (this.type === 'sparkle') {
      this.twinkle = (this.twinkle + dt * 5) % 1;
    } else if (this.type === 'rainbow') {
      this.hue = (this.hue + dt * 100) % 360;
    }
    
    return this.life > 0;
  }
  
  draw(ctx) {
    ctx.save();
    let alpha = Math.max(0, this.life);
    
    if (this.type === 'sparkle') {
      alpha *= 0.5 + Math.sin(this.twinkle * Math.PI * 2) * 0.5;
    } else if (this.type === 'gold' && this.sparkle > 0.5) {
      alpha *= 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
    }
    
    ctx.globalAlpha = alpha;
    
    if (this.type === 'feather') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
    } else if (this.type === 'rainbow') {
      ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
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

// ---------- Message System ----------
function showMessage(text, duration = 2000, type = 'default') {
  STATE.messages.push({
    text,
    duration,
    type,
    created: Date.now(),
    y: STATE.h * 0.2,
    alpha: 0,
  });
}

function updateMessages() {
  const now = Date.now();
  STATE.messages = STATE.messages.filter(msg => {
    const age = now - msg.created;
    if (age < 300) {
      msg.alpha = Math.min(1, age / 300);
      msg.y = STATE.h * 0.2 - (1 - msg.alpha) * 20 * STATE.dpr;
    } else if (age > msg.duration - 300) {
      msg.alpha = Math.max(0, (msg.duration - age) / 300);
      msg.y = STATE.h * 0.2 - (1 - msg.alpha) * 20 * STATE.dpr;
    } else {
      msg.alpha = 1;
    }
    return age < msg.duration;
  });
}

function drawMessages(ctx) {
  STATE.messages.forEach((msg, i) => {
    ctx.save();
    ctx.globalAlpha = msg.alpha;
    
    // Background
    const padding = 20 * STATE.dpr;
    ctx.font = `bold ${18 * STATE.dpr}px system-ui`;
    const width = ctx.measureText(msg.text).width + padding * 2;
    
    let bgColor = 'rgba(0,0,0,0.8)';
    if (msg.type === 'achievement') bgColor = 'rgba(255,215,0,0.9)';
    else if (msg.type === 'skin') bgColor = 'rgba(138,43,226,0.9)';
    else if (msg.type === 'gold') bgColor = 'rgba(255,215,0,0.8)';
    
    ctx.fillStyle = bgColor;
    ctx.roundRect((STATE.w - width) / 2, msg.y + i * 40 * STATE.dpr, width, 35 * STATE.dpr, 10 * STATE.dpr);
    ctx.fill();
    
    // Text
    ctx.fillStyle = msg.type === 'achievement' ? '#000' : '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(msg.text, STATE.w / 2, msg.y + i * 40 * STATE.dpr + 24 * STATE.dpr);
    
    ctx.restore();
  });
}

// ---------- Leaderboard System ----------
function updateLeaderboard() {
  const entry = {
    name: STATE.name,
    score: STATE.score,
    date: new Date().toISOString(),
    skin: STATE.player.skin,
    combo: STATE.maxCombo,
  };
  
  STATE.stats.leaderboard.push(entry);
  STATE.stats.leaderboard.sort((a, b) => b.score - a.score);
  STATE.stats.leaderboard = STATE.stats.leaderboard.slice(0, 10);
  
  saveStats();
}

function drawLeaderboard(ctx) {
  // Draw this on game over screen
  if (!els.over.classList.contains('show')) return;
  
  const leaders = STATE.stats.leaderboard.slice(0, 5);
  if (leaders.length === 0) return;
  
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.roundRect(STATE.w * 0.1, STATE.h * 0.5, STATE.w * 0.8, leaders.length * 30 * STATE.dpr + 40 * STATE.dpr, 10 * STATE.dpr);
  ctx.fill();
  
  ctx.fillStyle = '#ffd700';
  ctx.font = `bold ${16 * STATE.dpr}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText('🏆 LEADERBOARD 🏆', STATE.w * 0.5, STATE.h * 0.5 + 25 * STATE.dpr);
  
  ctx.font = `${14 * STATE.dpr}px system-ui`;
  leaders.forEach((entry, i) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    ctx.fillStyle = i === 0 ? '#ffd700' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${medals[i]} ${entry.name}: ${entry.score}`,
      STATE.w * 0.15,
      STATE.h * 0.5 + (i + 2) * 25 * STATE.dpr
    );
  });
  
  ctx.restore();
}

// ---------- Sound System ----------
const SOUNDS = {};
let soundEnabled = true;

// Initialize sounds - using web-friendly sound URLs
function initSounds() {
  // Option 1: Use free sound CDN URLs (these are example URLs - replace with actual sound URLs)
  const soundUrls = {
    flap: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    score: 'https://www.soundjay.com/misc/sounds/button-09.wav',
    perfect: 'https://www.soundjay.com/misc/sounds/button-10.wav',
    powerup: 'https://www.soundjay.com/misc/sounds/button-3.wav',
    crash: 'https://www.soundjay.com/misc/sounds/button-10.wav',
    achievement: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
    combo: 'https://www.soundjay.com/misc/sounds/button-09.wav'
  };
  
  // Option 2: Create synthetic sounds using Web Audio API (no files needed!)
  createSyntheticSounds();
}

// Create sounds programmatically using Web Audio API
function createSyntheticSounds() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Helper function to create a beep sound
  function createBeep(frequency, duration, type = 'sine') {
    return () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };
  }
  
  // Create different sounds with different frequencies
  SOUNDS.flap = createBeep(400, 0.1, 'square');
  SOUNDS.score = createBeep(523, 0.15, 'sine'); // C note
  SOUNDS.perfect = function() {
    createBeep(523, 0.1)(); // C
    setTimeout(() => createBeep(659, 0.1)(), 100); // E
    setTimeout(() => createBeep(784, 0.2)(), 200); // G
  };
  SOUNDS.powerup = function() {
    createBeep(440, 0.1)(); // A
    setTimeout(() => createBeep(554, 0.1)(), 100); // C#
    setTimeout(() => createBeep(659, 0.15)(), 200); // E
  };
  SOUNDS.crash = createBeep(150, 0.3, 'sawtooth');
  SOUNDS.achievement = function() {
    createBeep(523, 0.1)(); // C
    setTimeout(() => createBeep(587, 0.1)(), 100); // D
    setTimeout(() => createBeep(659, 0.1)(), 200); // E
    setTimeout(() => createBeep(784, 0.3)(), 300); // G
  };
  SOUNDS.combo = createBeep(880, 0.2, 'sine'); // A high
  SOUNDS.start = createBeep(440, 0.15, 'sine');
}

function playSound(name) {
  if (!soundEnabled) return;
  
  try {
    if (SOUNDS[name]) {
      if (typeof SOUNDS[name] === 'function') {
        SOUNDS[name]();
      } else if (SOUNDS[name].play) {
        SOUNDS[name].currentTime = 0;
        SOUNDS[name].play().catch(() => {});
      }
    }
  } catch (e) {
    console.log('Sound play failed:', e);
  }
}

// Make toggle function globally accessible
window.toggleGameSound = function() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('faceFlappySoundEnabled', soundEnabled);
  return soundEnabled;
};

// Load sound preference
function loadSoundPreference() {
  const saved = localStorage.getItem('faceFlappySoundEnabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
    // Update UI if it exists
    if (document.getElementById('soundIcon')) {
      document.getElementById('soundIcon').textContent = soundEnabled ? '🔊' : '🔇';
      document.getElementById('soundText').textContent = soundEnabled ? 'Sound ON' : 'Sound OFF';
    }
  }
}

// ---------- Storage System ----------
function saveStats() {
  localStorage.setItem('faceFlappyStats', JSON.stringify(STATE.stats));
}

function loadStats() {
  const saved = localStorage.getItem('faceFlappyStats');
  if (saved) {
    try {
      const stats = JSON.parse(saved);
      STATE.stats = { ...STATE.stats, ...stats };
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
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
  // Skip the API entirely - just use circle crop
  const dataUrl = await fileToDownscaledDataURL(file, 128); // Even smaller for mobile
  const fallback = await circleMaskFallback(dataUrl, 256);
  const stylized = await stylizeFace(fallback);
  return await loadImage(stylized);
}

// ---------- Canvas sizing ----------
function resizeCanvas() {
  if (!ctx) {
    ctx = els.canvas.getContext("2d");
  }
  const rect = els.canvas.getBoundingClientRect();
  
  // Debug logging
  console.log('Canvas rect:', rect.width, 'x', rect.height);
  
  // If canvas has no size, try again
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Canvas has no size, retrying...');
    setTimeout(resizeCanvas, 100);
    return;
  }
  
  STATE.dpr = Math.min(CFG.MAX_DPR, window.devicePixelRatio || 1);
  STATE.w = Math.max(320, Math.floor(rect.width * STATE.dpr));
  STATE.h = Math.max(320, Math.floor(rect.height * STATE.dpr));
  
  console.log('Canvas sized to:', STATE.w, 'x', STATE.h);
  
  els.canvas.width = STATE.w;
  els.canvas.height = STATE.h;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}
window.addEventListener("resize", resizeCanvas, { passive: true });

// ---------- Pipes ----------
function resetPipes() {
  STATE.pipes = [];
  STATE.nextPipeX = STATE.w + CFG.START_PIPES_DELAY * STATE.dpr;
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
    STATE.w + CFG.START_PIPES_DELAY * STATE.dpr);
  
  // Spawn power-ups
  if (Math.random() < CFG.POWERUP_SPAWN_CHANCE && STATE.score > 3) {
    const powerTypes = ['magnet', 'shrink', 'double', 'ghost', 'slowmo', 'balloon'];
    const weights = [20, 20, 15, 10, 20, 15]; // Weighted probability
    const type = weightedRandom(powerTypes, weights);
    
    STATE.powerups.active.push({
      x: x + 40 * STATE.dpr,
      y: gapY + rand(-gap/3, gap/3),
      type: type,
      collected: false,
      size: 20 * STATE.dpr,
    });
  }
  
  STATE.pipes.push({ x, gapY, gap, passed: false, perfect: false, closeCall: false });
}

function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) return items[i];
    random -= weights[i];
  }
  return items[0];
}

function rand(a, b) { return a + Math.random() * (b - a); }

// ---------- Difficulty Progression ----------
function updateDifficulty() {
  STATE.currentPipeSpeed = Math.min(
    CFG.PIPE_SPEED_MAX,
    CFG.PIPE_SPEED_INITIAL + (STATE.score * CFG.SPEED_INCREASE)
  );
  
  if (STATE.score > 0 && STATE.score % 5 === 0) {
    STATE.currentGapSize = Math.max(
      CFG.GAP_MIN,
      STATE.currentGapSize - CFG.GAP_SHRINK_RATE
    );
  }
}

// ---------- Game control ----------
function initGame() {
  resizeCanvas();  // ADD THIS LINE
  
  STATE.running = false;
  STATE.started = false;
  STATE.score = 0;
  STATE.combo = 0;
  STATE.maxCombo = 0;
  STATE.bgOffset = 0;
  STATE.fgOffset = 0;
  STATE.particles = [];
  STATE.screenShake = 0;
  STATE.flashEffect = 0;
  STATE.messages = [];
  STATE.currentPipeSpeed = CFG.PIPE_SPEED_INITIAL;
  STATE.currentGapSize = CFG.GAP_MAX;
  STATE.gameStartTime = 0;
  
  // Reset player
  STATE.player.y = STATE.h / 2;
  STATE.player.vy = 0;
  STATE.player.rotation = 0;
  STATE.player.wingPhase = 0;
  STATE.player.trail = [];
  
  // Reset powerups
  STATE.powerups = {
    active: [],
    magnet: false,
    magnetUntil: 0,
    shrink: false,
    shrinkUntil: 0,
    double: false,
    doublePipes: 0,
    ghost: false,
    ghostUntil: 0,
    slowmo: false,
    slowmoUntil: 0,
    balloon: false,
    balloonUntil: 0,
  };
  
  STATE.stats.totalGames++;
  checkAchievements();
  
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
  STATE.gameStartTime = performance.now();
  
  showMessage("Get Ready!", 1000);
  playSound('start');
  
  requestAnimationFrame(loop);
}

function gameOver(pipeIndex) {
  STATE.running = false;
  STATE.screenShake = 20;
  
  spawnParticles(STATE.player.x, STATE.player.y, 'star', 30);
  playSound('crash');
  
  // Update stats
  STATE.stats.totalScore += STATE.score;
  STATE.stats.totalTime += (performance.now() - STATE.gameStartTime) / 1000;
  
  // Check for new best
  const prevBest = STATE.best;
  STATE.best = Math.max(STATE.best, STATE.score);
  
  // Save progress
  const key = `ff_best_${STATE.name.trim().toLowerCase() || "player"}`;
  localStorage.setItem(key, String(STATE.best));
  
  updateLeaderboard();
  checkAchievements();
  saveStats();
  updateHud();
  
  // Show enhanced game over screen after a short delay
  setTimeout(() => {
    showEnhancedGameOver(prevBest);
  }, 500);
}

function showEnhancedGameOver(prevBest) {
  // Create enhanced game over screen
  const overlay = els.over;
  overlay.innerHTML = `
    <div class="dialog enhanced-dialog">
      <div class="game-over-header">
        <h2>Game Over!</h2>
        ${STATE.best > prevBest ? '<div class="new-record">🏆 NEW RECORD! 🏆</div>' : ''}
      </div>
      
      <div class="score-display">
        <div class="final-score">
          <div class="score-number">${STATE.score}</div>
          <div class="score-label">SCORE</div>
        </div>
        
        <div class="score-stats">
          <div class="stat-row">
            <span>Best Score:</span>
            <span class="stat-value">${STATE.best}</span>
          </div>
          <div class="stat-row">
            <span>Max Combo:</span>
            <span class="stat-value">${STATE.maxCombo}x</span>
          </div>
          <div class="stat-row">
            <span>Perfect Passes:</span>
            <span class="stat-value">${STATE.stats.perfectPasses}</span>
          </div>
          <div class="stat-row">
            <span>Power-ups:</span>
            <span class="stat-value">${STATE.stats.powerupsCollected}</span>
          </div>
        </div>
      </div>
      
      ${STATE.stats.unlockedAchievements.length > 0 ? `
        <div class="unlocks-section">
          ${getNewUnlocksHTML()}
        </div>
      ` : ''}
      
      <div class="leaderboard-mini">
        <h3>🏆 Top Scores</h3>
        <div class="leaderboard-list">
          ${getLeaderboardHTML()}
        </div>
      </div>
      
      <div class="actions-enhanced">
        <button id="retryBtn" class="primary big-button">
          <span class="button-icon">🔄</span>
          <span>Play Again</span>
        </button>
        <button id="shareBtn" class="share-button">
          <span class="button-icon">📤</span>
          <span>Share</span>
        </button>
        <button id="menuBtn" class="menu-button">
          <span class="button-icon">🏠</span>
          <span>Menu</span>
        </button>
      </div>
      
      <div class="motivational">
        ${getMotivationalMessage()}
      </div>
    </div>
  `;
  
  // Add enhanced styles
  addGameOverStyles();
  
  // Re-attach event listeners
  document.getElementById('retryBtn').addEventListener('click', () => {
    STATE.stats.retryCount++;
    checkAchievements();
    hideOverlay();
    initGame();
    setTimeout(() => startGame(), 500);
  });
  
  document.getElementById('shareBtn').addEventListener('click', async () => {
    STATE.stats.shareCount++;
    checkAchievements();
    
    const emoji = STATE.score > 50 ? "🔥🔥🔥" : 
                  STATE.score > 25 ? "⭐⭐" : 
                  STATE.score > 10 ? "⭐" : "🎮";
    const skinText = STATE.player.skin !== 'classic' ? ` using ${SKINS[STATE.player.skin].name} skin` : '';
    const text = `${emoji} ${STATE.name} scored ${STATE.score} on Face Flappy${skinText}! Can you beat it? 🦅`;
    
    try {
      await navigator.clipboard.writeText(text);
      document.getElementById('shareBtn').innerHTML = '<span class="button-icon">✅</span><span>Copied!</span>';
      setTimeout(() => {
        document.getElementById('shareBtn').innerHTML = '<span class="button-icon">📤</span><span>Share</span>';
      }, 1500);
    } catch {
      prompt("Copy your score:", text);
    }
  });
  
  document.getElementById('menuBtn').addEventListener('click', () => {
    // Return to menu
    document.getElementById('gamePanel').classList.remove('game-active');
    els.form.classList.remove('hidden');
    hideOverlay();
    
    // Update stats display
    if (window.updateStatsDisplay) {
      window.updateStatsDisplay(STATE.stats);
    }
  });
  
  showOverlay();
  
  if (STATE.best > prevBest) {
    STATE.flashEffect = 2;
    playSound('achievement');
  }
}

function getNewUnlocksHTML() {
  // Check if any new achievements or skins were unlocked this game
  const newAchievements = []; // Track in the game session
  const newSkins = []; // Track in the game session
  
  let html = '<div class="new-unlocks">';
  
  if (newAchievements.length > 0 || newSkins.length > 0) {
    html += '<h4>🎊 New Unlocks!</h4>';
    // Add unlock details
  }
  
  html += '</div>';
  return html;
}

function getLeaderboardHTML() {
  const leaders = STATE.stats.leaderboard.slice(0, 5);
  if (leaders.length === 0) {
    return '<div class="no-scores">No high scores yet!</div>';
  }
  
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  let html = '';
  
  leaders.forEach((entry, i) => {
    const isCurrentGame = entry.score === STATE.score && entry.name === STATE.name;
    html += `
      <div class="leader-row ${isCurrentGame ? 'current' : ''}">
        <span class="leader-medal">${medals[i]}</span>
        <span class="leader-name">${entry.name}</span>
        <span class="leader-score">${entry.score}</span>
      </div>
    `;
  });
  
  return html;
}

function getMotivationalMessage() {
  const messages = {
    low: [
      "Keep practicing! You've got this! 💪",
      "Every expert was once a beginner! 🌟",
      "You're getting better each time! 📈"
    ],
    medium: [
      "Great job! You're improving! 🎯",
      "Nice run! Keep it up! 🚀",
      "You're getting the hang of it! ⭐"
    ],
    high: [
      "Wow! You're a natural! 🦅",
      "Incredible skills! 🏆",
      "You're a Face Flappy master! 👑"
    ],
    record: [
      "LEGENDARY PERFORMANCE! 🌟🌟🌟",
      "ABSOLUTELY INCREDIBLE! 🔥🔥🔥",
      "YOU'RE THE CHAMPION! 🏆👑🏆"
    ]
  };
  
  let category = 'low';
  if (STATE.score === STATE.best && STATE.best > 0) category = 'record';
  else if (STATE.score >= 50) category = 'high';
  else if (STATE.score >= 20) category = 'medium';
  
  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}

function addGameOverStyles() {
  // Check if styles already exist
  if (document.getElementById('gameOverStyles')) return;
  
  const style = document.createElement('style');
  style.id = 'gameOverStyles';
  style.textContent = `
    .enhanced-dialog {
      padding: 24px;
      max-width: 520px;
      animation: slideUpBounce 0.5s ease;
    }
    
    @keyframes slideUpBounce {
      0% { transform: translateY(50px) scale(0.9); opacity: 0; }
      80% { transform: translateY(-5px) scale(1.01); }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    .game-over-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .game-over-header h2 {
      font-size: 32px;
      margin: 0;
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .new-record {
      font-size: 18px;
      color: #ffd700;
      margin-top: 8px;
      animation: pulse 1s ease infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .score-display {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea15, #764ba215);
      border-radius: 12px;
    }
    
    .final-score {
      text-align: center;
      padding: 10px;
    }
    
    .score-number {
      font-size: 48px;
      font-weight: bold;
      color: #4f7cff;
      line-height: 1;
    }
    
    .score-label {
      font-size: 14px;
      color: #6b768a;
      margin-top: 4px;
    }
    
    .score-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #435;
    }
    
    .stat-value {
      font-weight: bold;
      color: #4f7cff;
    }
    
    .leaderboard-mini {
      margin: 20px 0;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .leaderboard-mini h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      text-align: center;
    }
    
    .leader-row {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      gap: 10px;
      padding: 6px;
      margin: 4px 0;
      border-radius: 6px;
      transition: background 0.2s;
    }
    
    .leader-row.current {
      background: linear-gradient(45deg, #ffd70020, #ffed4e20);
      border: 1px solid #ffd700;
    }
    
    .leader-medal {
      text-align: center;
    }
    
    .leader-name {
      font-weight: 500;
    }
    
    .leader-score {
      font-weight: bold;
      color: #4f7cff;
    }
    
    .no-scores {
      text-align: center;
      color: #6b768a;
      padding: 20px;
    }
    
    .actions-enhanced {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 10px;
      margin: 20px 0;
    }
    
    .big-button {
      padding: 14px 20px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .big-button:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 20px rgba(79, 124, 255, 0.3);
    }
    
    .share-button, .menu-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      gap: 4px;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .share-button:hover, .menu-button:hover {
      transform: translateY(-1px);
      background: #f0f4ff;
    }
    
    .button-icon {
      font-size: 20px;
    }
    
    .motivational {
      text-align: center;
      font-size: 14px;
      color: #6b768a;
      font-style: italic;
      padding: 10px;
      border-top: 1px solid #eee;
      margin-top: 10px;
    }
    
    .new-unlocks {
      background: linear-gradient(135deg, #9c27b015, #673ab715);
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
    }
    
    .new-unlocks h4 {
      margin: 0 0 8px 0;
      color: #9c27b0;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      .score-display {
        grid-template-columns: 1fr;
      }
      
      .actions-enhanced {
        grid-template-columns: 1fr;
      }
      
      .share-button, .menu-button {
        flex-direction: row;
      }
    }
  `;
  document.head.appendChild(style);
}

function updateHud() {
  let scoreText = `Score: ${STATE.score}`;
  if (STATE.combo >= 5) {
    scoreText += ` (${Math.floor(STATE.combo / 5)}x Combo!)`;
  }
  if (STATE.powerups.double) {
    scoreText += " [2X]";
  }
  
  els.score.textContent = scoreText;
  els.nameHud.textContent = `Player: ${STATE.name || "–"}`;
  els.bestHud.textContent = `Best: ${STATE.best || 0}`;
  
  // Show skin info
  const skin = SKINS[STATE.player.skin];
  if (skin && skin.name !== 'Classic') {
    els.bestHud.textContent += ` | Skin: ${skin.name}`;
  }
  
  // Show streak
  if (STATE.stats.dailyStreak > 0) {
    els.bestHud.textContent += ` | 🔥${STATE.stats.dailyStreak}`;
  }
}

function showOverlay() { 
  els.over.classList.add("show"); 
}

function hideOverlay() { 
  els.over.classList.remove("show"); 
}

// ---------- Main Game Loop ----------
function loop(t) {
  if (!STATE.running) return;
  const dt = Math.min(0.033, (t - STATE.tLast) / 1000 || 0.016);
  STATE.tLast = t;
  update(dt, t);
  drawFrame(dt, t);
  requestAnimationFrame(loop);
}

function update(dt, t) {
  // Update visual effects
  if (STATE.screenShake > 0) {
    STATE.screenShake *= 0.9;
    if (STATE.screenShake < 0.5) STATE.screenShake = 0;
  }
  if (STATE.flashEffect > 0) {
    STATE.flashEffect -= dt * 2;
  }
  
  // Update messages
  updateMessages();
  
  // Check powerup expiry
  const now = performance.now();
  if (STATE.powerups.magnet && now > STATE.powerups.magnetUntil) {
    STATE.powerups.magnet = false;
  }
  if (STATE.powerups.shrink && now > STATE.powerups.shrinkUntil) {
    STATE.powerups.shrink = false;
  }
  if (STATE.powerups.ghost && now > STATE.powerups.ghostUntil) {
    STATE.powerups.ghost = false;
  }
  if (STATE.powerups.slowmo && now > STATE.powerups.slowmoUntil) {
    STATE.powerups.slowmo = false;
    updateDifficulty(); // Reset speed
  }
  if (STATE.powerups.balloon && now > STATE.powerups.balloonUntil) {
    STATE.powerups.balloon = false;
  }
  
  // Parallax scrolling (affected by slowmo)
  const speedMod = STATE.powerups.slowmo ? 0.5 : 1;
  STATE.bgOffset = (STATE.bgOffset + CFG.BG_SCROLL * STATE.dpr * dt * speedMod) % STATE.w;
  STATE.fgOffset = (STATE.fgOffset + CFG.FG_SCROLL * STATE.dpr * dt * speedMod) % STATE.w;

  // Player physics
  const gravityMod = STATE.powerups.balloon ? 0.6 : 1;
  STATE.player.vy += CFG.GRAVITY * dt * STATE.dpr * gravityMod;
  
  // Magnet effect
  if (STATE.powerups.magnet && STATE.pipes.length > 0) {
    const nearestPipe = STATE.pipes.find(p => p.x > STATE.player.x - 50 * STATE.dpr);
    if (nearestPipe) {
      const targetY = nearestPipe.gapY;
      const pullForce = 300 * STATE.dpr * dt;
      if (STATE.player.y < targetY - 20 * STATE.dpr) {
        STATE.player.vy += pullForce;
      } else if (STATE.player.y > targetY + 20 * STATE.dpr) {
        STATE.player.vy -= pullForce;
      }
    }
  }
  
  STATE.player.y += STATE.player.vy * dt;
  
  // Update rotation
  const targetRotation = Math.max(-30, Math.min(30, STATE.player.vy * 0.05));
  STATE.player.rotation += (targetRotation - STATE.player.rotation) * 0.1;
  
  // Wing animation
  STATE.player.wingPhase += dt * 12;
  if (STATE.player.wingFlapPower > 0) {
    STATE.player.wingFlapPower -= dt * 3;
    
    // Spawn particles based on skin
    const skin = SKINS[STATE.player.skin];
    if (skin && skin.particle) {
      spawnParticles(
        STATE.player.x - STATE.player.r, 
        STATE.player.y, 
        skin.particle, 
        1
      );
    } else {
      spawnParticles(
        STATE.player.x - STATE.player.r, 
        STATE.player.y, 
        'feather', 
        1
      );
    }
  }
  
  // Trail effect for certain skins
  const skin = SKINS[STATE.player.skin];
  if (skin && skin.trail) {
    STATE.player.trail.push({
      x: STATE.player.x,
      y: STATE.player.y,
      alpha: 1,
    });
    STATE.player.trail = STATE.player.trail.filter(t => {
      t.alpha -= dt * 2;
      return t.alpha > 0;
    });
  }

  // Ceiling collision
  if (STATE.player.y - STATE.player.r < 0) {
    STATE.player.y = STATE.player.r;
    STATE.player.vy = 0;
  }
  
  // Ground collision
  if (STATE.player.y + STATE.player.r > STATE.h) {
    STATE.player.y = STATE.h - STATE.player.r;
    if (!STATE.powerups.ghost) {
      return gameOver(STATE.score);
    }
  }

  // Update pipes
  const pipeSpeed = STATE.currentPipeSpeed * speedMod;
  for (let i = 0; i < STATE.pipes.length; i++) {
    const p = STATE.pipes[i];
    p.x -= pipeSpeed * STATE.dpr * dt;

    // Score when passing
    if (!p.passed && p.x + 60 * STATE.dpr < STATE.player.x) {
      p.passed = true;
      
      let points = 1;
      if (STATE.powerups.double) {
        points = 2;
        STATE.powerups.doublePipes--;
        if (STATE.powerups.doublePipes <= 0) {
          STATE.powerups.double = false;
        }
      }
      
      STATE.score += points;
      STATE.combo++;
      STATE.maxCombo = Math.max(STATE.maxCombo, STATE.combo);
      
      // Check for perfect pass
      const centerDiff = Math.abs(STATE.player.y - p.gapY);
      if (centerDiff < 30 * STATE.dpr) {
        p.perfect = true;
        STATE.stats.perfectPasses++;
        STATE.score += 2;
        spawnParticles(STATE.player.x, STATE.player.y, 'star', 15);
        showMessage("PERFECT! +2", 1000, 'gold');
        playSound('perfect');
      } else {
        playSound('score');
      }
      
      // Check combo milestones
      if (STATE.combo > 0 && STATE.combo % 5 === 0) {
        showMessage(`${STATE.combo} Combo!`, 1500, 'gold');
        spawnParticles(STATE.player.x, STATE.player.y, 'achievement', 10);
        playSound('combo');
      }
      
      updateDifficulty();
      checkAchievements();
      updateHud();
      
      spawnParticles(STATE.player.x, STATE.player.y, 'star', 5);
    }

    // Collision detection
    if (!STATE.powerups.ghost) {
      const halfPipeW = 40 * STATE.dpr;
      const sizeMod = STATE.powerups.shrink ? 0.5 : 1;
      const effectiveRadius = STATE.player.r * CFG.COLLISION_FORGIVENESS * sizeMod;
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
        if (!p.closeCall) {
          const nearMiss = 
            circleRectCollide(STATE.player.x, STATE.player.y, effectiveRadius * 1.3, topRect) ||
            circleRectCollide(STATE.player.x, STATE.player.y, effectiveRadius * 1.3, botRect);
          
          if (nearMiss) {
            p.closeCall = true;
            STATE.stats.closeCalls++;
            showMessage("Close Call!", 500);
            spawnParticles(STATE.player.x, STATE.player.y, 'feather', 3);
          }
        }
      }
    }
  }

  // Update power-ups
  STATE.powerups.active = STATE.powerups.active.filter(pu => {
    pu.x -= pipeSpeed * STATE.dpr * dt;
    
    // Pulse animation
    pu.size = (20 + Math.sin(t * 0.005) * 3) * STATE.dpr;
    
    // Collection detection
    const dist = Math.hypot(pu.x - STATE.player.x, pu.y - STATE.player.y);
    const collectRadius = STATE.powerups.shrink ? STATE.player.r * 0.5 : STATE.player.r;
    
    if (dist < collectRadius + pu.size && !pu.collected) {
      pu.collected = true;
      STATE.stats.powerupsCollected++;
      spawnParticles(pu.x, pu.y, 'star', 20);
      playSound('powerup');
      
      // Activate power-up
      switch(pu.type) {
        case 'magnet':
          STATE.powerups.magnet = true;
          STATE.powerups.magnetUntil = now + CFG.POWERUP_MAGNET_DURATION;
          showMessage("🧲 Magnet Active!", 2000);
          break;
        case 'shrink':
          STATE.powerups.shrink = true;
          STATE.powerups.shrinkUntil = now + CFG.POWERUP_SHRINK_DURATION;
          showMessage("🔻 Shrink Mode!", 2000);
          break;
        case 'double':
          STATE.powerups.double = true;
          STATE.powerups.doublePipes = CFG.POWERUP_DOUBLE_DURATION;
          showMessage("2️⃣ Double Points!", 2000);
          break;
        case 'ghost':
          STATE.powerups.ghost = true;
          STATE.powerups.ghostUntil = now + CFG.POWERUP_GHOST_DURATION;
          showMessage("👻 Ghost Mode!", 2000);
          break;
        case 'slowmo':
          STATE.powerups.slowmo = true;
          STATE.powerups.slowmoUntil = now + CFG.POWERUP_SLOWMO_DURATION;
          showMessage("⏱️ Slow Motion!", 2000);
          break;
        case 'balloon':
          STATE.powerups.balloon = true;
          STATE.powerups.balloonUntil = now + CFG.POWERUP_BALLOON_DURATION;
          showMessage("🎈 Balloon Power!", 2000);
          break;
      }
      
      checkAchievements();
      return false;
    }
    
    return pu.x > -100 * STATE.dpr && !pu.collected;
  });

  // Add new pipes
  const last = STATE.pipes[STATE.pipes.length - 1];
  if (last && last.x < STATE.w - CFG.PIPE_SPACING * STATE.dpr) {
    addPipe();
  }
  
  // Remove offscreen pipes
  while (STATE.pipes.length && STATE.pipes[0].x < -100 * STATE.dpr) {
    STATE.pipes.shift();
  }

  // Update particles
  STATE.particles = STATE.particles.filter(p => p.update(dt));
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

  // Flash effect
  if (STATE.flashEffect > 0) {
    ctx.fillStyle = `rgba(255,255,255,${STATE.flashEffect * 0.3})`;
    ctx.fillRect(0, 0, w, h);
  }

  // Dynamic sky
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (STATE.powerups.slowmo) {
    g.addColorStop(0, "#4a0080");
    g.addColorStop(1, "#8b008b");
  } else if (STATE.theme === "day") {
    g.addColorStop(0, "#92d7ff");
    g.addColorStop(1, "#e4f6ff");
  } else {
    g.addColorStop(0, "#6aa0ff");
    g.addColorStop(1, "#dfe9ff");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Background clouds
  ctx.save();
  ctx.translate(-STATE.bgOffset, 0);
  drawCloudBand(40 * STATE.dpr, 0.6);
  ctx.translate(w, 0);
  drawCloudBand(40 * STATE.dpr, 0.6);
  ctx.restore();

  // Draw trail
  if (STATE.player.trail.length > 0) {
    STATE.player.trail.forEach((t, i) => {
      ctx.save();
      ctx.globalAlpha = t.alpha * 0.3;
      const size = (STATE.player.r * 0.8) * (i / STATE.player.trail.length);
      const hue = (Date.now() * 0.1 + i * 10) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Draw pipes
  const halfPipeW = 40 * STATE.dpr;
  for (const p of STATE.pipes) {
    const gapHalf = p.gap / 2;
    
    // Ghost effect
    if (STATE.powerups.ghost) {
      ctx.globalAlpha = 0.3;
    }
    
    // Pipe gradient
    const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + halfPipeW*2, 0);
    if (STATE.powerups.slowmo) {
      pipeGrad.addColorStop(0, "#4b0082");
      pipeGrad.addColorStop(0.5, "#6b0082");
      pipeGrad.addColorStop(1, "#8b008b");
    } else {
      pipeGrad.addColorStop(0, "#2eb356");
      pipeGrad.addColorStop(0.5, "#3cb371");
      pipeGrad.addColorStop(1, "#2a9d4f");
    }
    ctx.fillStyle = pipeGrad;
    
    // Top pipe
    const topH = p.gapY - gapHalf;
    if (topH > 0) {
      ctx.fillRect(p.x, 0, halfPipeW*2, topH);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(p.x + 10*STATE.dpr, 0, 5*STATE.dpr, topH);
    }
    
    // Bottom pipe
    const botY = p.gapY + gapHalf;
    const botH = h - botY;
    if (botH > 0) {
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(p.x, botY, halfPipeW*2, botH);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(p.x + 10*STATE.dpr, botY, 5*STATE.dpr, botH);
    }
    
    ctx.globalAlpha = 1;
    
    // Perfect zone indicator
    if (!p.passed && !STATE.powerups.magnet) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,215,0,0.3)";
      ctx.lineWidth = 2 * STATE.dpr;
      ctx.setLineDash([5 * STATE.dpr, 5 * STATE.dpr]);
      ctx.strokeRect(
        p.x - 10*STATE.dpr, 
        p.gapY - 30*STATE.dpr, 
        halfPipeW*2 + 20*STATE.dpr, 
        60*STATE.dpr
      );
      ctx.restore();
    }
  }

  // Draw power-ups
  for (const pu of STATE.powerups.active) {
    if (pu.collected) continue;
    
    ctx.save();
    ctx.translate(pu.x, pu.y);
    ctx.rotate(t * 0.002);
    
    // Power-up colors
    const colors = {
      magnet: ['#4ac8ff', '#2196F3'],
      shrink: ['#9c27b0', '#673ab7'],
      double: ['#ffd700', '#ffb300'],
      ghost: ['#ffffff', '#e0e0e0'],
      slowmo: ['#8b008b', '#4a0080'],
      balloon: ['#ff69b4', '#ff1493'],
    };
    
    const [color1, color2] = colors[pu.type] || ['#fff', '#ccc'];
    
    // Glow effect
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, pu.size * 2);
    glow.addColorStop(0, color1 + '40');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, pu.size * 2, 0, Math.PI*2);
    ctx.fill();
    
    // Main circle
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, pu.size);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, pu.size, 0, Math.PI*2);
    ctx.fill();
    
    // Icon
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${pu.size}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = {
      magnet: '🧲',
      shrink: '🔻',
      double: '2️⃣',
      ghost: '👻',
      slowmo: '⏱️',
      balloon: '🎈',
    };
    ctx.fillText(icons[pu.type] || '?', 0, 0);
    
    ctx.restore();
  }

  // Draw particles
  for (const particle of STATE.particles) {
    particle.draw(ctx);
  }

  // Foreground
  ctx.save();
  ctx.translate(-STATE.fgOffset, 0);
  const groundGrad = ctx.createLinearGradient(0, h - 40*STATE.dpr, 0, h);
  if (STATE.powerups.slowmo) {
    groundGrad.addColorStop(0, "#4a0080");
    groundGrad.addColorStop(1, "#2d004d");
  } else {
    groundGrad.addColorStop(0, "#8bc34a");
    groundGrad.addColorStop(1, "#689f38");
  }
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h - 24*STATE.dpr, w*2, 24*STATE.dpr);
  ctx.restore();

  // Draw player based on character type
  const px = STATE.player.x, py = STATE.player.y;
  const baseRadius = STATE.player.r;
  const r = STATE.powerups.shrink ? baseRadius * 0.5 : baseRadius;
  
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(STATE.player.rotation * Math.PI / 180);
  
  // Power-up effects
  if (STATE.powerups.ghost) {
    ctx.globalAlpha = 0.5;
  }
  
  if (STATE.powerups.magnet) {
    // Magnetic field effect
    ctx.strokeStyle = `rgba(100,200,255,${0.2 + Math.sin(t * 0.01) * 0.1})`;
    ctx.lineWidth = 2 * STATE.dpr;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, r + i * 15 * STATE.dpr, 0, Math.PI*2);
      ctx.stroke();
    }
  }
  
  if (STATE.powerups.balloon) {
    // Balloon string
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1 * STATE.dpr;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, -r - 30 * STATE.dpr);
    ctx.stroke();
    
    // Balloon
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.ellipse(0, -r - 40 * STATE.dpr, 15 * STATE.dpr, 20 * STATE.dpr, 0, 0, Math.PI*2);
    ctx.fill();
  }
  
  // Draw character based on selection
  const character = STATE.player.character || 'bird';
  
  if (character === 'bird') {
    drawBird(ctx, r, t);
  } else if (character === 'unicorn') {
    drawUnicorn(ctx, r, t);
  } else if (character === 'cat') {
    drawCat(ctx, r, t);
  }
  
  ctx.restore();

function drawBird(ctx, r, t) {
  const skin = SKINS[STATE.player.skin];
  
  // Body with skin
  if (skin.body.includes('gradient')) {
    const gradMatch = skin.body.match(/linear-gradient\(([^,]+),\s*(.+)\)/);
    if (gradMatch) {
      const colors = gradMatch[2].split(',').map(c => c.trim().replace(')', ''));
      const bodyGrad = ctx.createLinearGradient(-r, -r, r, r);
      colors.forEach((color, i) => {
        bodyGrad.addColorStop(i / (colors.length - 1), color);
      });
      ctx.fillStyle = bodyGrad;
    }
  } else {
    ctx.fillStyle = skin.body;
  }
  
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.fill();
  
  // BIGGER Animated wings
  ctx.fillStyle = skin.wing;
  const wingFlap = Math.sin(STATE.player.wingPhase) * 20 * STATE.dpr; // Increased flap range
  const wingSize = (STATE.player.wingFlapPower > 0 ? 1.5 : 1.2) * CFG.WING_SIZE;
  
  // Left wing (bigger and more visible)
  ctx.save();
  ctx.translate(-r * 0.8, 0);
  ctx.rotate((wingFlap / 25) - 0.2);
  ctx.scale(wingSize, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.7, r * 0.5, -0.2, 0, Math.PI*2);
  ctx.fill();
  
  // Wing detail
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2 * STATE.dpr;
  ctx.stroke();
  ctx.restore();
  
  // Right wing (background, also bigger)
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.translate(r * 0.5, 0);
  ctx.rotate((-wingFlap / 35) + 0.1);
  ctx.scale(wingSize * 0.8, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.5, r * 0.4, 0.1, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Face
  if (STATE.faceImg) {
    const size = CFG.FACE_SIZE * STATE.dpr * (STATE.powerups.shrink ? 0.5 : 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r - 4*STATE.dpr, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(STATE.faceImg, -size/2, -size/2, size, size);
    ctx.restore();
  }
  
  // BIGGER Beak
  ctx.fillStyle = "#ff9800";
  ctx.strokeStyle = "#e65100";
  ctx.lineWidth = 1 * STATE.dpr;
  const beakSize = CFG.BEAK_SIZE;
  ctx.beginPath();
  ctx.moveTo(r - 3*STATE.dpr, 0);
  ctx.lineTo(r + 12*STATE.dpr * beakSize, 0);
  ctx.lineTo(r - 3*STATE.dpr, 10*STATE.dpr * beakSize);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Eye (for expression)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(r/3, -r/3, 3*STATE.dpr, 0, Math.PI*2);
  ctx.fill();
  
  // Add small tail feathers
  ctx.fillStyle = skin.wing;
  ctx.save();
  ctx.translate(-r * 0.9, r * 0.3);
  ctx.rotate(-0.3);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.3, r * 0.15, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawUnicorn(ctx, r, t) {
  const skin = SKINS[STATE.player.skin];
  
  // Body (slightly elongated for unicorn)
  const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  bodyGrad.addColorStop(0, "#ffb3ff");
  bodyGrad.addColorStop(0.5, "#ff99ff");
  bodyGrad.addColorStop(1, "#ff66ff");
  ctx.fillStyle = bodyGrad;
  
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.95, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Mane (flowing rainbow)
  const maneColors = ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0099ff', '#9900ff'];
  ctx.save();
  ctx.translate(-r * 0.7, -r * 0.5);
  maneColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7;
    const offset = Math.sin(STATE.player.wingPhase + i) * 5 * STATE.dpr;
    ctx.beginPath();
    ctx.ellipse(offset, i * 4 * STATE.dpr, 15 * STATE.dpr, 8 * STATE.dpr, -0.3, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
  ctx.globalAlpha = 1;
  
  // HORN (the defining feature!)
  const hornSize = CFG.HORN_SIZE;
  ctx.save();
  ctx.translate(r * 0.6, -r * 0.6);
  ctx.rotate(-0.3);
  
  // Horn gradient
  const hornGrad = ctx.createLinearGradient(0, 0, 15 * STATE.dpr * hornSize, -25 * STATE.dpr * hornSize);
  hornGrad.addColorStop(0, "#ffd700");
  hornGrad.addColorStop(0.5, "#ffed4e");
  hornGrad.addColorStop(1, "#ffffff");
  ctx.fillStyle = hornGrad;
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(12 * STATE.dpr * hornSize, -25 * STATE.dpr * hornSize);
  ctx.lineTo(8 * STATE.dpr * hornSize, 0);
  ctx.closePath();
  ctx.fill();
  
  // Spiral on horn
  ctx.strokeStyle = "#ffaa00";
  ctx.lineWidth = 1.5 * STATE.dpr;
  ctx.beginPath();
  ctx.moveTo(4 * STATE.dpr, -2 * STATE.dpr);
  ctx.lineTo(10 * STATE.dpr * hornSize, -20 * STATE.dpr * hornSize);
  ctx.stroke();
  ctx.restore();
  
  // Wings (magical fairy wings)
  const wingFlap = Math.sin(STATE.player.wingPhase) * 25 * STATE.dpr;
  const wingSize = STATE.player.wingFlapPower > 0 ? 1.6 : 1.3;
  
  // Wing gradient
  const wingGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.8);
  wingGrad.addColorStop(0, "rgba(255,255,255,0.8)");
  wingGrad.addColorStop(0.5, "rgba(255,200,255,0.6)");
  wingGrad.addColorStop(1, "rgba(255,150,255,0.4)");
  
  // Left wing
  ctx.save();
  ctx.fillStyle = wingGrad;
  ctx.translate(-r * 0.9, -r * 0.1);
  ctx.rotate((wingFlap / 20) - 0.4);
  ctx.scale(wingSize, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.8, r * 0.6, -0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Face
  if (STATE.faceImg) {
    const size = CFG.FACE_SIZE * STATE.dpr * (STATE.powerups.shrink ? 0.5 : 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r - 4*STATE.dpr, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(STATE.faceImg, -size/2, -size/2, size, size);
    ctx.restore();
  }
  
  // Sparkles around unicorn
  ctx.fillStyle = "#ffd700";
  for (let i = 0; i < 3; i++) {
    const sparkleAngle = (t * 0.002 + i * 2) % (Math.PI * 2);
    const sparkleX = Math.cos(sparkleAngle) * (r + 20 * STATE.dpr);
    const sparkleY = Math.sin(sparkleAngle) * (r + 20 * STATE.dpr);
    ctx.globalAlpha = 0.5 + Math.sin(t * 0.01 + i) * 0.5;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, 2 * STATE.dpr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Tail
  ctx.save();
  ctx.translate(-r, r * 0.2);
  const tailGrad = ctx.createLinearGradient(0, 0, -20 * STATE.dpr, 10 * STATE.dpr);
  tailGrad.addColorStop(0, "#ff99ff");
  tailGrad.addColorStop(1, "#ffccff");
  ctx.fillStyle = tailGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.4, r * 0.2, 0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawCat(ctx, r, t) {
  const skin = SKINS[STATE.player.skin];
  
  // Body (fluffy and round)
  const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  bodyGrad.addColorStop(0, "#ffa366");
  bodyGrad.addColorStop(0.7, "#ff8c42");
  bodyGrad.addColorStop(1, "#ff7328");
  ctx.fillStyle = bodyGrad;
  
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.fill();
  
  // Stripes
  ctx.strokeStyle = "#ff6b1a";
  ctx.lineWidth = 3 * STATE.dpr;
  ctx.globalAlpha = 0.4;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, i * 0.3 - 0.5, i * 0.3 + 0.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  
  // BIGGER Cat ears
  const earSize = CFG.EAR_SIZE;
  
  // Left ear
  ctx.save();
  ctx.translate(-r * 0.6, -r * 0.7);
  ctx.fillStyle = "#ff8c42";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-10 * STATE.dpr * earSize, -20 * STATE.dpr * earSize);
  ctx.lineTo(10 * STATE.dpr * earSize, -15 * STATE.dpr * earSize);
  ctx.closePath();
  ctx.fill();
  
  // Inner ear
  ctx.fillStyle = "#ffb399";
  ctx.beginPath();
  ctx.moveTo(0, -5 * STATE.dpr);
  ctx.lineTo(-5 * STATE.dpr * earSize, -15 * STATE.dpr * earSize);
  ctx.lineTo(5 * STATE.dpr * earSize, -12 * STATE.dpr * earSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // Right ear
  ctx.save();
  ctx.translate(r * 0.6, -r * 0.7);
  ctx.fillStyle = "#ff8c42";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-10 * STATE.dpr * earSize, -15 * STATE.dpr * earSize);
  ctx.lineTo(10 * STATE.dpr * earSize, -20 * STATE.dpr * earSize);
  ctx.closePath();
  ctx.fill();
  
  // Inner ear
  ctx.fillStyle = "#ffb399";
  ctx.beginPath();
  ctx.moveTo(0, -5 * STATE.dpr);
  ctx.lineTo(-5 * STATE.dpr * earSize, -12 * STATE.dpr * earSize);
  ctx.lineTo(5 * STATE.dpr * earSize, -15 * STATE.dpr * earSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // Paws (instead of wings, cats use paws to "swim" through air)
  const pawMotion = Math.sin(STATE.player.wingPhase) * 15 * STATE.dpr;
  const pawSize = STATE.player.wingFlapPower > 0 ? 1.4 : 1.1;
  
  // Front left paw
  ctx.save();
  ctx.translate(-r * 0.7, r * 0.3);
  ctx.rotate((pawMotion / 30) + 0.3);
  ctx.fillStyle = "#ff7328";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12 * STATE.dpr * pawSize, 18 * STATE.dpr * pawSize, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Paw pads
  ctx.fillStyle = "#ff5500";
  ctx.beginPath();
  ctx.arc(0, 5 * STATE.dpr, 3 * STATE.dpr, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Front right paw
  ctx.save();
  ctx.translate(r * 0.7, r * 0.3);
  ctx.rotate((-pawMotion / 30) - 0.3);
  ctx.fillStyle = "#ff7328";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12 * STATE.dpr * pawSize, 18 * STATE.dpr * pawSize, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Paw pads
  ctx.fillStyle = "#ff5500";
  ctx.beginPath();
  ctx.arc(0, 5 * STATE.dpr, 3 * STATE.dpr, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
  
  // Face
  if (STATE.faceImg) {
    const size = CFG.FACE_SIZE * STATE.dpr * (STATE.powerups.shrink ? 0.5 : 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r - 4*STATE.dpr, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(STATE.faceImg, -size/2, -size/2, size, size);
    ctx.restore();
  }
  
  // Cat nose (pink triangle)
  ctx.fillStyle = "#ff69b4";
  ctx.beginPath();
  ctx.moveTo(r - 5*STATE.dpr, 0);
  ctx.lineTo(r - 2*STATE.dpr, -3*STATE.dpr);
  ctx.lineTo(r + 2*STATE.dpr, 0);
  ctx.lineTo(r - 2*STATE.dpr, 3*STATE.dpr);
  ctx.closePath();
  ctx.fill();
  
  // Whiskers
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1 * STATE.dpr;
  
  // Left whiskers
  ctx.beginPath();
  ctx.moveTo(r * 0.5, -5 * STATE.dpr);
  ctx.lineTo(r + 15 * STATE.dpr, -8 * STATE.dpr);
  ctx.moveTo(r * 0.5, 0);
  ctx.lineTo(r + 18 * STATE.dpr, 0);
  ctx.moveTo(r * 0.5, 5 * STATE.dpr);
  ctx.lineTo(r + 15 * STATE.dpr, 8 * STATE.dpr);
  ctx.stroke();
  
  // Tail (long and fluffy)
  ctx.save();
  ctx.translate(-r * 0.8, r * 0.1);
  ctx.rotate(Math.sin(STATE.player.wingPhase * 0.5) * 0.2);
  ctx.fillStyle = "#ff8c42";
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.6, r * 0.2, 0.5, 0, Math.PI*2);
  ctx.fill();
  
  // Tail stripes
  ctx.strokeStyle = "#ff6b1a";
  ctx.lineWidth = 2 * STATE.dpr;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(-5 * STATE.dpr, 0, r * 0.15, 0, Math.PI*2);
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
}
  
  // Power-up status bar
  drawPowerupStatus(ctx);
  
  // Messages
  drawMessages(ctx);
  
  // Leaderboard on game over
  if (els.over.classList.contains('show')) {
    drawLeaderboard(ctx);
  }
  
  // Daily challenge indicator
  if (STATE.stats.currentChallenge && STATE.started && !STATE.running) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(10*STATE.dpr, h - 80*STATE.dpr, w - 20*STATE.dpr, 70*STATE.dpr);
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${14*STATE.dpr}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillText('📅 Daily Challenge:', 20*STATE.dpr, h - 55*STATE.dpr);
    ctx.fillStyle = '#fff';
    ctx.font = `${12*STATE.dpr}px system-ui`;
    ctx.fillText(STATE.stats.currentChallenge.name, 20*STATE.dpr, h - 35*STATE.dpr);
    ctx.fillText(STATE.stats.currentChallenge.desc, 20*STATE.dpr, h - 15*STATE.dpr);
  }
  
  // Start screen
  if (!STATE.started) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, h/2 - 100*STATE.dpr, w, 200*STATE.dpr);
    
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${24 * STATE.dpr}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("TAP or SPACE to Fly!", w/2, h/2 - 20*STATE.dpr);
    
    ctx.font = `${14 * STATE.dpr}px system-ui`;
    ctx.fillText("🎮 Much easier difficulty!", w/2, h/2 + 10*STATE.dpr);
    ctx.fillText("✨ Collect power-ups for special abilities", w/2, h/2 + 35*STATE.dpr);
    ctx.fillText("🏆 Unlock skins and achievements", w/2, h/2 + 60*STATE.dpr);
    
    // Show unlocked skins count
    const unlockedCount = STATE.stats.unlockedSkins.length;
    const totalSkins = Object.keys(SKINS).length;
    ctx.fillStyle = "#ffd700";
    ctx.font = `bold ${12 * STATE.dpr}px system-ui`;
    ctx.fillText(`Skins: ${unlockedCount}/${totalSkins} | Achievements: ${STATE.stats.unlockedAchievements.length}/${Object.keys(ACHIEVEMENTS).length}`, w/2, h/2 + 85*STATE.dpr);
  }
  
  // Restore from screen shake
  ctx.restore();
}

function drawPowerupStatus(ctx) {
  const now = performance.now();
  let y = 60 * STATE.dpr;
  
  const activePowerups = [];
  if (STATE.powerups.magnet) {
    activePowerups.push({
      icon: '🧲',
      time: (STATE.powerups.magnetUntil - now) / 1000,
      color: '#4ac8ff'
    });
  }
  if (STATE.powerups.shrink) {
    activePowerups.push({
      icon: '🔻',
      time: (STATE.powerups.shrinkUntil - now) / 1000,
      color: '#9c27b0'
    });
  }
  if (STATE.powerups.double) {
    activePowerups.push({
      icon: '2️⃣',
      time: STATE.powerups.doublePipes,
      color: '#ffd700'
    });
  }
  if (STATE.powerups.ghost) {
    activePowerups.push({
      icon: '👻',
      time: (STATE.powerups.ghostUntil - now) / 1000,
      color: '#ffffff'
    });
  }
  if (STATE.powerups.slowmo) {
    activePowerups.push({
      icon: '⏱️',
      time: (STATE.powerups.slowmoUntil - now) / 1000,
      color: '#8b008b'
    });
  }
  if (STATE.powerups.balloon) {
    activePowerups.push({
      icon: '🎈',
      time: (STATE.powerups.balloonUntil - now) / 1000,
      color: '#ff69b4'
    });
  }
  
  activePowerups.forEach((pu, i) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10*STATE.dpr, y + i * 35*STATE.dpr, 100*STATE.dpr, 30*STATE.dpr);
    
    ctx.fillStyle = pu.color;
    ctx.font = `${16*STATE.dpr}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillText(pu.icon, 15*STATE.dpr, y + i * 35*STATE.dpr + 20*STATE.dpr);
    
    ctx.fillStyle = '#fff';
    ctx.font = `${12*STATE.dpr}px system-ui`;
    const timeText = typeof pu.time === 'number' ? 
      (pu.time > 0 ? pu.time.toFixed(1) + 's' : pu.time + ' left') : 
      pu.time;
    ctx.fillText(timeText, 40*STATE.dpr, y + i * 35*STATE.dpr + 20*STATE.dpr);
    
    ctx.restore();
  });
}

function drawCloudBand(y, opacity=0.6) {
  const { w } = STATE;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = STATE.powerups.slowmo ? "rgba(150,100,200,.4)" : "rgba(255,255,255,.9)";
  for (let x = 0; x < w * 2; x += 180 * STATE.dpr) {
    ctx.beginPath();
    ctx.ellipse(x + 40*STATE.dpr, y + 16*STATE.dpr, 50*STATE.dpr, 22*STATE.dpr, 0, 0, Math.PI*2);
    ctx.ellipse(x + 80*STATE.dpr, y + 10*STATE.dpr, 38*STATE.dpr, 18*STATE.dpr, 0, 0, Math.PI*2);
    ctx.ellipse(x + 120*STATE.dpr, y + 20*STATE.dpr, 44*STATE.dpr, 20*STATE.dpr, 0, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------- Input ----------
function flap() {
  if (!STATE.started) {
    startGame();
  } else if (STATE.running) {
    STATE.player.vy = -CFG.FLAP * STATE.dpr;
    STATE.player.wingFlapPower = 1;
    STATE.stats.totalFlaps++;
    playSound('flap');
    
    const skin = SKINS[STATE.player.skin];
    if (skin && skin.particle) {
      spawnParticles(
        STATE.player.x - STATE.player.r,
        STATE.player.y + STATE.player.r/2,
        skin.particle,
        2
      );
    } else {
      spawnParticles(
        STATE.player.x - STATE.player.r,
        STATE.player.y + STATE.player.r/2,
        'feather',
        2
      );
    }
  }
}

// Keyboard controls
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    e.preventDefault();
    flap();
  }
  
  // Pause
  if (e.key === "p" || e.key === "P") {
    if (STATE.started && !els.over.classList.contains('show')) {
      STATE.paused = !STATE.paused;
      if (STATE.paused) {
        STATE.running = false;
        showMessage("PAUSED - Press P to Resume", 100000);
      } else {
        STATE.running = true;
        STATE.tLast = performance.now();
        STATE.messages = [];
        requestAnimationFrame(loop);
      }
    }
  }
  
  // Sound toggle (M for mute)
  if (e.key === "m" || e.key === "M") {
    const enabled = toggleSound();
    showMessage(enabled ? "🔊 Sound ON" : "🔇 Sound OFF", 1000);
  }
  
  // Skin selection (1-9 keys)
  if (e.key >= '1' && e.key <= '9') {
    const skinIndex = parseInt(e.key) - 1;
    const skinKeys = Object.keys(SKINS);
    if (skinIndex < skinKeys.length) {
      const skinKey = skinKeys[skinIndex];
      if (STATE.stats.unlockedSkins.includes(skinKey)) {
        STATE.player.skin = skinKey;
        showMessage(`Skin: ${SKINS[skinKey].name}`, 1000);
      } else {
        showMessage(`🔒 ${SKINS[skinKey].description}`, 2000);
      }
    }
  }
});

// Touch/click controls
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
  if (!name || !file) {
    alert("Please enter your name and select a photo");
    return;
  }
  
  // Check file size (mobile browsers can struggle with large images)
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    alert("Please choose a smaller photo (under 5MB)");
    return;
  }
  
  // Get selected character
  STATE.player.character = window.selectedCharacter || 'bird';

  const key = `ff_best_${name.toLowerCase()}`;
  STATE.best = parseInt(localStorage.getItem(key) || "0", 10) || 0;
  STATE.name = name;
  
  loadStats();
  checkAchievements();
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

// Show loading message
showMessage("Loading your face...", 3000);
  
// Hide the left panel and expand game area
document.getElementById('gamePanel').classList.add('game-active');
els.form.style.pointerEvents = 'none'; // Prevent double-submission

// Force the browser to recalculate layout
els.form.offsetHeight; // This forces a reflow

// Wait for CSS transition to complete
setTimeout(() => {
  // Force refresh canvas reference
  els.canvas = document.getElementById("game");
  if (typeof ctx !== 'undefined') {
    ctx = els.canvas.getContext("2d");
  }
  
  resizeCanvas();
  
  // Check if canvas has valid dimensions
  if (STATE.w > 0 && STATE.h > 0) {
    initGame();
    showMessage("👆 TAP or SPACE to Start!", 3000);
    els.form.style.pointerEvents = 'auto';
  } else {
    // If still no size, try again
    setTimeout(() => {
      resizeCanvas();
      initGame();
      showMessage("👆 TAP or SPACE to Start!", 3000);
      els.form.style.pointerEvents = 'auto';
    }, 500);
  }
}, 700); // Wait for CSS transition
});

// ---------- Boot ----------
function boot() {
  resizeCanvas();
  loadStats();
  loadSoundPreference(); // Load saved sound preference
  initSounds(); // Initialize the sound system
  

  
  // Show version
  ctx.font = `${10 * STATE.dpr}px system-ui`;
  ctx.fillStyle = "#666";
  ctx.fillText("Face Flappy Ultimate v2.0", STATE.w/2, STATE.h - 20*STATE.dpr);
}

boot();
