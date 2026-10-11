// --- BIRTHDAY WEBSITE INTERACTIVE JAVASCRIPT ---

// 1. LOADING SCREEN PROGRESSION
let loadProgress = 0;
const loaderBar = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');
const enterBtn = document.getElementById('enter-btn');
const loaderScreen = document.getElementById('loader-screen');

const loadInterval = setInterval(() => {
  loadProgress += Math.floor(Math.random() * 8) + 4;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    loaderBar.style.width = '100%';
    loaderPercent.innerText = '100% Ready!';
    enterBtn.style.display = 'inline-block';
  } else {
    loaderBar.style.width = loadProgress + '%';
    loaderPercent.innerText = loadProgress + '%';
  }
}, 80);

enterBtn.addEventListener('click', () => {
  loaderScreen.style.opacity = '0';
  setTimeout(() => {
    loaderScreen.style.display = 'none';
    triggerConfettiCannon();
    initAudioAndPlay();
  }, 800);
});

// 2. WEB AUDIO API SYNTHESIZER FOR BIRTHDAY MELODY (Zero external dependencies)
let audioCtx = null;
let isPlayingMelody = false;
let melodyTimeout = null;

const birthdayNotes = [
  { f: 261.63, d: 0.35 }, // C4
  { f: 261.63, d: 0.25 }, // C4
  { f: 293.66, d: 0.6 },  // D4
  { f: 261.63, d: 0.6 },  // C4
  { f: 349.23, d: 0.6 },  // F4
  { f: 329.63, d: 1.1 },  // E4

  { f: 261.63, d: 0.35 }, // C4
  { f: 261.63, d: 0.25 }, // C4
  { f: 293.66, d: 0.6 },  // D4
  { f: 261.63, d: 0.6 },  // C4
  { f: 392.00, d: 0.6 },  // G4
  { f: 349.23, d: 1.1 },  // F4

  { f: 261.63, d: 0.35 }, // C4
  { f: 261.63, d: 0.25 }, // C4
  { f: 523.25, d: 0.6 },  // C5
  { f: 440.00, d: 0.6 },  // A4
  { f: 349.23, d: 0.6 },  // F4
  { f: 329.63, d: 0.6 },  // E4
  { f: 293.66, d: 1.0 },  // D4

  { f: 466.16, d: 0.35 }, // Bb4
  { f: 466.16, d: 0.25 }, // Bb4
  { f: 440.00, d: 0.6 },  // A4
  { f: 349.23, d: 0.6 },  // F4
  { f: 392.00, d: 0.6 },  // G4
  { f: 349.23, d: 1.4 }   // F4
];

function playTone(freq, duration) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // Sweet music-box like chime
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn(e);
  }
}

function playNoteSequence(index = 0) {
  if (!isPlayingMelody) return;
  if (index >= birthdayNotes.length) {
    // Loop after pause
    melodyTimeout = setTimeout(() => {
      playNoteSequence(0);
    }, 2000);
    return;
  }

  const note = birthdayNotes[index];
  playTone(note.f, note.d);

  melodyTimeout = setTimeout(() => {
    playNoteSequence(index + 1);
  }, note.d * 1000 + 70);
}

const musicBtn = document.getElementById('music-btn');
const musicIndicator = document.getElementById('music-indicator');
const musicText = document.getElementById('music-text');

function initAudioAndPlay() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  isPlayingMelody = true;
  musicIndicator.classList.remove('muted');
  musicText.innerText = 'Pause Melody';
  musicBtn.classList.add('active');
  playNoteSequence(0);
}

function toggleAudio() {
  if (!audioCtx) {
    initAudioAndPlay();
    return;
  }
  if (isPlayingMelody) {
    isPlayingMelody = false;
    clearTimeout(melodyTimeout);
    musicIndicator.classList.add('muted');
    musicText.innerText = 'Play Melody';
    musicBtn.classList.remove('active');
  } else {
    initAudioAndPlay();
  }
}

musicBtn.addEventListener('click', toggleAudio);

// Sound effect for chime
function playChime(pitch = 587.33) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  playTone(pitch, 0.4);
}

// 3. TYPING EFFECT
const phrases = [
  "Wishing you a lifetime of happiness, peace & joy! ✨",
  "May Allah protect you from every difficulty 🤍",
  "Ameen sum Ameen to every prayer of your heart 🤲🏻",
  "26th October — Celebrating an extraordinary person! 🌟",
  "Keep shining and always stay the amazing soul you are! 💖"
];

let pIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const currentPhrase = phrases[pIndex];
  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    pIndex = (pIndex + 1) % phrases.length;
    delay = 500;
  }

  setTimeout(typeEffect, delay);
}
typeEffect();

// 4. COUNTDOWN TIMER TO 26TH OCTOBER
function updateCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let targetDate = new Date(currentYear, 9, 26, 0, 0, 0); // October is month index 9

  // If already past 26 Oct this year, target next year
  if (now > targetDate && (now.getDate() !== 26 || now.getMonth() !== 9)) {
    targetDate = new Date(currentYear + 1, 9, 26, 0, 0, 0);
  }

  const isToday = (now.getMonth() === 9 && now.getDate() === 26);
  if (isToday) {
    document.getElementById('cd-days').innerText = '🎂';
    document.getElementById('cd-hours').innerText = '🎉';
    document.getElementById('cd-mins').innerText = '✨';
    document.getElementById('cd-secs').innerText = '🎈';
    return;
  }

  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
  document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').innerText = String(secs).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// 5. CONFETTI & PARTICLES SYSTEM
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor(x, y, isCannon = false) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? (isCannon ? canvas.height : Math.random() * -canvas.height);
    this.size = Math.random() * 8 + 5;
    this.colors = ['#ff4d79', '#ffd166', '#a855f7', '#06d6a0', '#ffffff', '#ff7597', '#f4c430'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.speedX = (Math.random() - 0.5) * (isCannon ? 14 : 3);
    this.speedY = isCannon ? -(Math.random() * 16 + 8) : Math.random() * 2.5 + 1.5;
    this.gravity = isCannon ? 0.35 : 0.05;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 8;
    this.opacity = 1;
    this.isCannon = isCannon;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.isCannon) {
      this.speedY += this.gravity;
    }
    this.rotation += this.rotSpeed;

    if (this.isCannon && this.speedY > 0) {
      this.opacity -= 0.008;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

// Subtle ambient falling flakes
for (let i = 0; i < 40; i++) {
  particles.push(new ConfettiParticle(null, null, false));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();

    if (p.isCannon && (p.opacity <= 0 || p.y > canvas.height + 20)) {
      particles.splice(i, 1);
    } else if (!p.isCannon && p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

function triggerConfettiCannon() {
  playChime(659.25);
  for (let i = 0; i < 90; i++) {
    particles.push(new ConfettiParticle(canvas.width * 0.3, canvas.height, true));
    particles.push(new ConfettiParticle(canvas.width * 0.7, canvas.height, true));
  }
}

document.getElementById('trigger-confetti-btn')?.addEventListener('click', triggerConfettiCannon);

// Party Mode Toggle
let partyInterval = null;
const partyBtn = document.getElementById('party-mode-btn');
partyBtn.addEventListener('click', () => {
  if (partyInterval) {
    clearInterval(partyInterval);
    partyInterval = null;
    partyBtn.classList.remove('active');
  } else {
    partyBtn.classList.add('active');
    triggerConfettiCannon();
    partyInterval = setInterval(() => {
      triggerConfettiCannon();
    }, 1800);
  }
});

// 6. AMEEN COUNTER & FLOATING HEARTS
let ameenTotal = 100;
const ameenCountEl = document.getElementById('ameen-count');
const btnAmeen = document.getElementById('btn-ameen');

btnAmeen.addEventListener('click', (e) => {
  ameenTotal++;
  ameenCountEl.innerText = ameenTotal;
  playChime(783.99); // Chime G5
  createFloatingHeart(e.clientX, e.clientY, '🤲🏻 Ameen! 🤍');
  createFloatingHeart(e.clientX + 30, e.clientY - 20, '🌸');
});

function createFloatingHeart(x, y, emoji = '🤍') {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.innerText = emoji;
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.setProperty('--tx', (Math.random() * 80 - 40) + 'px');
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

// Click anywhere for sparkling heart burst
document.addEventListener('click', (e) => {
  // Ignore clicks on control buttons to keep them clean
  if (e.target.closest('button') || e.target.closest('a')) return;
  const icons = ['✨', '🤍', '🌸', '🎈', '💖'];
  createFloatingHeart(e.clientX, e.clientY, icons[Math.floor(Math.random() * icons.length)]);
});

// Like Dua Card counter
function likeDua(btn) {
  const span = btn.querySelector('span');
  let count = parseInt(span.innerText, 10);
  count++;
  span.innerText = count;
  playChime(880);
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => btn.style.transform = 'scale(1)', 200);
}

// 7. WISHES TABS
function switchWishTab(tabId, btn) {
  document.querySelectorAll('.wish-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).style.display = 'block';
  btn.classList.add('active');
  playChime(523.25);
}

// 8. GAME 1: BALLOON POPPER
const balloonArena = document.getElementById('balloon-arena');
const balloonScoreEl = document.getElementById('balloon-score');
const balloonComplimentEl = document.getElementById('balloon-compliment');
let balloonScore = 0;

const balloonEmojis = ['🎈', '🎈', '🎈', '🎈', '🎈'];
const sweetCompliments = [
  "You're a true gem of kindness! 💎",
  "May your laughter never fade! 😂✨",
  "You inspire everyone with your dedication! 🚀",
  "May Allah give you the happiest year ahead! 🤲🏻🤍",
  "Always look as stylish & charismatic as today! 🕶️🔥",
  "Success is written all over your path! 🌟"
];

function spawnBalloon() {
  const b = document.createElement('div');
  b.className = 'balloon-entity';
  b.innerText = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
  b.style.left = Math.random() * 80 + 10 + '%';
  
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    balloonScore += 10;
    balloonScoreEl.innerText = balloonScore;
    playChime(659.25 + (balloonScore % 200));
    createFloatingHeart(e.clientX, e.clientY, '💥✨');
    balloonComplimentEl.innerText = sweetCompliments[Math.floor(Math.random() * sweetCompliments.length)];
    b.remove();
  });

  balloonArena.appendChild(b);
  setTimeout(() => { if (b.parentNode) b.remove(); }, 4000);
}

document.getElementById('spawn-balloon-btn').addEventListener('click', () => {
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnBalloon, i * 350);
  }
});
setInterval(spawnBalloon, 2200);

// 9. GAME 2: CANDLE BLOW
let candleBlown = false;
function blowCandle() {
  const flame = document.getElementById('cake-flame');
  const msg = document.getElementById('cake-msg');
  if (!candleBlown) {
    candleBlown = true;
    flame.classList.add('blown');
    msg.innerHTML = '🎉 Woohoo! Your wish is on its way to the stars! ✨ Ameen 🤲🏻';
    triggerConfettiCannon();
    playChime(987.77);
  } else {
    // Relight
    candleBlown = false;
    flame.classList.remove('blown');
    msg.innerHTML = 'Candle relit! Make another wish and tap! 🕯️';
    playChime(523.25);
  }
}

// 10. GAME 3: SCRATCH CARD
const scratchCanvas = document.getElementById('scratch-canvas');
const sCtx = scratchCanvas.getContext('2d');
let isDrawing = false;

function initScratchCard() {
  const rect = scratchCanvas.getBoundingClientRect();
  scratchCanvas.width = rect.width || 300;
  scratchCanvas.height = rect.height || 180;

  // Fill with shimmering rose-gold silver gradient
  const grad = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
  grad.addColorStop(0, '#d4af37');
  grad.addColorStop(0.5, '#e0a9af');
  grad.addColorStop(1, '#9333ea');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  sCtx.font = 'bold 15px Outfit, sans-serif';
  sCtx.fillStyle = '#ffffff';
  sCtx.textAlign = 'center';
  sCtx.fillText('✨ Scratch Here to Reveal Dua ✨', scratchCanvas.width / 2, scratchCanvas.height / 2 + 5);
}

function scratch(e) {
  if (!isDrawing) return;
  const rect = scratchCanvas.getBoundingClientRect();
  const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
  const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

  sCtx.globalCompositeOperation = 'destination-out';
  sCtx.beginPath();
  sCtx.arc(x, y, 22, 0, Math.PI * 2);
  sCtx.fill();
}

scratchCanvas.addEventListener('mousedown', () => isDrawing = true);
scratchCanvas.addEventListener('mouseup', () => isDrawing = false);
scratchCanvas.addEventListener('mousemove', scratch);

scratchCanvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
scratchCanvas.addEventListener('touchend', () => isDrawing = false);
scratchCanvas.addEventListener('touchmove', scratch);

function resetScratch() {
  sCtx.globalCompositeOperation = 'source-over';
  initScratchCard();
  playChime(600);
}
setTimeout(initScratchCard, 300);

// 11. GAME 4: COMPLIMENT GENERATOR
const fortunes = [
  "“You have an aura that lights up any room you enter! 🌟”",
  "“May this year bring unmeasurable success to all your endeavors! 💼✨”",
  "“Allah protect your smile from every sorrow! Ameen. 🌸🤍”",
  "“A person with a pure heart like yours deserves the very best of everything! 🥹💖”",
  "“May you achieve every single milestone you have envisioned! 🚀”",
  "“Your kindness and charm make you unforgettable! 👑”"
];

function drawNewCompliment() {
  const el = document.getElementById('random-compliment');
  el.style.opacity = '0';
  playChime(700);
  setTimeout(() => {
    el.innerText = fortunes[Math.floor(Math.random() * fortunes.length)];
    el.style.opacity = '1';
  }, 200);
}

// 12. MODALS (PHOTO & GIFT)
function openPhotoModal(src, caption) {
  const modal = document.getElementById('photo-modal');
  document.getElementById('modal-img').src = src;
  document.getElementById('modal-caption').innerText = caption;
  modal.classList.add('active');
  playChime(659.25);
}

function closePhotoModal() {
  document.getElementById('photo-modal').classList.remove('active');
}

function openGiftModal() {
  document.getElementById('gift-modal').classList.add('active');
  triggerConfettiCannon();
  playChime(880);
}

function closeGiftModal() {
  document.getElementById('gift-modal').classList.remove('active');
}

// Close modals on clicking backdrop
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});
