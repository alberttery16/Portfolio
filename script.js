// Inicialización de Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// --- BOOT LOADER (PRELOADER) ---
const loaderCounter = document.querySelector('.loader-counter');
const loaderText = document.querySelector('.loader-text');
const loader = document.querySelector('.loader');

let count = 0;
gsap.to(loaderCounter, { opacity: 1, duration: 0.5 });
gsap.to(loaderText, { opacity: 1, duration: 0.5 });

const bootInterval = setInterval(() => {
  count += Math.floor(Math.random() * 10) + 1;
  if(count >= 100) {
    count = 100;
    clearInterval(bootInterval);
    finishBoot();
  }
  loaderCounter.innerHTML = count + '%';
}, 50);

function finishBoot() {
  loaderText.innerHTML = "ACCESS_GRANTED";
  loaderText.style.color = "#00f3ff";
  
  const tl = gsap.timeline();
  tl.to(loaderCounter, { opacity: 0, duration: 0.5, y: -50, ease: "power2.in" })
    .to(loaderText, { opacity: 0, duration: 0.5, y: 50, ease: "power2.in" }, "-=0.4")
    .to(loader, { height: 0, duration: 1, ease: "expo.inOut" })
    .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.2")
    .from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8")
    .from(".grid-floor", { opacity: 0, duration: 2 }, "-=1");
}

// --- CUSTOM CURSOR ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveHoverElements = document.querySelectorAll('a, .project-panel, .hero-title, .social-btn, .bento-item, .tech-node, input, textarea');

let mouseX = 0, mouseY = 0;
let fX = 0, fY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
});

gsap.ticker.add(() => {
  fX += (mouseX - fX) * 0.1;
  fY += (mouseY - fY) * 0.1;
  follower.style.transform = `translate3d(${fX}px, ${fY}px, 0) translate(-50%, -50%)`;
});

interactiveHoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('magnet');
    follower.classList.add('magnet');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('magnet');
    follower.classList.remove('magnet');
  });
});

// MAGNETIC HERO TITLE
const heroTitle = document.querySelector('.hero-title');
if(heroTitle) {
  heroTitle.addEventListener('mousemove', (e) => {
    const rect = heroTitle.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(heroTitle, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.5,
      ease: "power2.out"
    });
  });
  
  heroTitle.addEventListener('mouseleave', () => {
    gsap.to(heroTitle, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  });
}

// --- TEXT REVEAL LOGIC (Manual Split Text) ---
const revealTextContainer = document.querySelector('.reveal-text');
if(revealTextContainer) {
  // Split words manually since we don't have SplitText premium plugin
  const words = revealTextContainer.innerText.split(' ');
  revealTextContainer.innerHTML = '';
  
  words.forEach(word => {
    const span = document.createElement('span');
    span.classList.add('word');
    span.innerText = word;
    revealTextContainer.appendChild(span);
  });

  const wordElements = document.querySelectorAll('.word');
  
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(wordElements, {
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 60%",
      end: "bottom 80%",
      scrub: 1 // smooth scrubbing
    },
    color: "#fff",
    textShadow: "0 0 10px rgba(255,255,255,0.8)",
    stagger: 0.1
  });
}

// --- HORIZONTAL SCROLL FOR PROJECTS ---
gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('.horizontal-scroll-container');
const panelsWrapper = document.querySelector('.panels-wrapper');

if(scrollContainer && panelsWrapper) {
  function getScrollAmount() {
    let scrollWidth = scrollContainer.scrollWidth;
    return -(scrollWidth - window.innerWidth);
  }

  const tween = gsap.to(scrollContainer, {
    x: getScrollAmount,
    ease: "none"
  });

  ScrollTrigger.create({
    trigger: ".horizontal-projects-section",
    start: "top top",
    end: () => `+=${scrollContainer.scrollWidth}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true
  });
}

// --- MINIGAME: NEURAL DECRYPT (Simon Says) ---
const startHackBtn = document.getElementById('start-hack-btn');
const gameStatus = document.getElementById('game-status');
const layerCountDisplay = document.getElementById('layer-count');
const nodes = [
  document.getElementById('node-1'),
  document.getElementById('node-2'),
  document.getElementById('node-3'),
  document.getElementById('node-4')
];

let systemSequence = [];
let playerSequence = [];
let currentLevel = 0;
let isAcceptingInput = false;

if(startHackBtn) {
  startHackBtn.addEventListener('click', () => {
    startGame();
  });

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      if(!isAcceptingInput) return;
      
      const colorId = parseInt(e.target.getAttribute('data-color'));
      flashNode(colorId);
      playerSequence.push(colorId);
      checkSequence();
    });
  });
}

function startGame() {
  systemSequence = [];
  currentLevel = 0;
  startHackBtn.style.display = 'none';
  gameStatus.innerText = "SISTEMA INICIADO";
  gameStatus.className = "game-status";
  nextLevel();
}

function nextLevel() {
  currentLevel++;
  playerSequence = [];
  layerCountDisplay.innerText = currentLevel;
  
  // Add random node (1-4)
  const nextNode = Math.floor(Math.random() * 4) + 1;
  systemSequence.push(nextNode);
  
  gameStatus.innerText = "OBSERVA LA SECUENCIA...";
  isAcceptingInput = false;
  
  // Play sequence
  playSequence();
}

function playSequence() {
  let delay = 0;
  // Reduce speed slightly over levels to keep it fast
  const speed = Math.max(300, 800 - (currentLevel * 100)); 
  
  systemSequence.forEach((nodeId, index) => {
    setTimeout(() => {
      flashNode(nodeId);
    }, delay);
    delay += speed;
  });
  
  // Allow input after sequence finishes
  setTimeout(() => {
    gameStatus.innerText = "INGRESA SECUENCIA";
    isAcceptingInput = true;
  }, delay);
}

function flashNode(id) {
  const node = document.querySelector(`.simon-node[data-color="${id}"]`);
  if(!node) return;
  
  node.classList.add('active');
  setTimeout(() => {
    node.classList.remove('active');
  }, 200); // quick flash
}

function checkSequence() {
  const currentIndex = playerSequence.length - 1;
  
  if(playerSequence[currentIndex] !== systemSequence[currentIndex]) {
    // FAIL -> End of the game
    gameOver();
    return;
  }
  
  if(playerSequence.length === systemSequence.length) {
    // Passed this level! Infinite progression.
    isAcceptingInput = false;
    gameStatus.innerText = "NIVEL SUPERADO...";
    setTimeout(nextLevel, 1000);
  }
}

function gameOver() {
  isAcceptingInput = false;
  gameStatus.innerText = "ERROR DE SECUENCIA";
  gameStatus.className = "game-status fail";
  startHackBtn.innerText = "REINICIAR";
  startHackBtn.style.display = 'block';
  
  // Fail flash all red
  nodes.forEach(n => {
    n.style.background = "#f00";
    n.style.boxShadow = "0 0 20px #f00";
    setTimeout(() => {
      n.style.background = "";
      n.style.boxShadow = "";
    }, 500);
  });

  // Calculate score (currentLevel - 1 because they failed the current one)
  const score = currentLevel - 1;
  if(score > 0) {
    setTimeout(() => {
      handleScore(score);
    }, 600);
  }
}

// --- LEADERBOARD LOGIC ---
const leaderboardList = document.getElementById('leaderboard-list');
const LEADERBOARD_KEY = 'neural_decrypt_leaderboard';

function getLeaderboard() {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLeaderboard(board) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
}

function handleScore(score) {
  const name = prompt(`¡Hackeo fallido pero alcanzaste el Nivel ${score}!\nIntroduce tu ALIAS para el ranking global:`);
  if(name && name.trim() !== '') {
    const board = getLeaderboard();
    board.push({ name: name.trim().substring(0, 10), score: score });
    board.sort((a, b) => b.score - a.score);
    // Keep top 10
    if(board.length > 10) board.length = 10;
    saveLeaderboard(board);
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  if(!leaderboardList) return;
  const board = getLeaderboard();
  leaderboardList.innerHTML = '';
  
  if(board.length === 0) {
    leaderboardList.innerHTML = '<li><span style="width:100%;text-align:center;">SIN DATOS DE USUARIOS</span></li>';
    return;
  }
  
  board.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = `rank-${index + 1}`;
    li.innerHTML = `<span>#${index + 1} ${entry.name}</span> <span style="color:var(--color-primary)">Lvl ${entry.score}</span>`;
    leaderboardList.appendChild(li);
  });
}

// Initial render
if(leaderboardList) {
  renderLeaderboard();
}

// ==========================================
// --- 6 WOW FEATURES INCORPORATION ---
// ==========================================

// 1. SOUNDSCAPE (Web Audio API)
let audioCtx;
let userHasInteracted = false;

function playBeep(freq = 600, type = 'sine', duration = 0.05, vol = 0.1) {
  if (!userHasInteracted) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

document.body.addEventListener('click', () => { userHasInteracted = true; });
document.querySelectorAll('a, button, .project-panel, .simon-node, .bento-item, .tech-node').forEach(el => {
  el.addEventListener('mouseenter', () => playBeep(800, 'sine', 0.05, 0.05));
  el.addEventListener('click', () => playBeep(1200, 'square', 0.1, 0.1));
});

// 2. DEV CONSOLE (Easter Egg)
const devConsole = document.getElementById('dev-console');
const devInput = document.getElementById('dev-input');
const devOutput = document.getElementById('dev-output');

document.addEventListener('keydown', (e) => {
  if(e.key === 'º' || e.key === '`' || e.key === '~') {
    e.preventDefault();
    devConsole.classList.toggle('active');
    if(devConsole.classList.contains('active')) devInput.focus();
    playBeep(400, 'sawtooth', 0.2);
  }
});

if(devInput) {
  devInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      const cmd = devInput.value.toLowerCase().trim();
      devInput.value = '';
      
      const outLine = document.createElement('div');
      outLine.textContent = '> ' + cmd;
      devOutput.appendChild(outLine);
      
      const response = document.createElement('div');
      
      if(cmd === 'help') {
        response.textContent = "Comandos: theme red, theme cyan, download cv, clear, rm -rf /";
      } else if (cmd === 'theme red') {
        document.documentElement.style.setProperty('--color-primary', '#ff0000');
        response.textContent = "Tema cambiado a ROJO TÁCTICO.";
      } else if (cmd === 'theme cyan') {
        document.documentElement.style.setProperty('--color-primary', '#00f3ff');
        response.textContent = "Tema restaurado.";
      } else if (cmd === 'clear') {
        devOutput.innerHTML = '';
      } else if (cmd === 'download cv') {
        response.textContent = "INICIANDO DESCARGA HOLOGRÁFICA...";
        document.getElementById('hologram-overlay').classList.add('active');
        devConsole.classList.remove('active');
      } else if (cmd === 'rm -rf /') {
        response.textContent = "CRITICAL ERROR: SIMULANDO DESTRUCCIÓN DEL SISTEMA...";
        response.style.color = 'red';
        setTimeout(() => document.body.style.display = 'none', 1000);
      } else {
        response.textContent = "Comando no reconocido.";
      }
      devOutput.appendChild(response);
      devOutput.scrollTop = devOutput.scrollHeight;
    }
  });
}

// 3. HOLOGRAM CV
const cvTrigger = document.getElementById('cv-trigger');
const hologramOverlay = document.getElementById('hologram-overlay');
const closeHologram = document.getElementById('close-hologram');
const hologramCard = document.getElementById('hologram-card');

if(cvTrigger) {
  cvTrigger.addEventListener('click', () => {
    hologramOverlay.classList.add('active');
    playBeep(900, 'sine', 0.5);
  });
}
if(closeHologram) {
  closeHologram.addEventListener('click', () => {
    hologramOverlay.classList.remove('active');
  });
}
if(hologramCard) {
  hologramOverlay.addEventListener('mousemove', (e) => {
    const rect = hologramCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    hologramCard.style.transform = `perspective(1000px) rotateX(${-y * 0.05}deg) rotateY(${x * 0.05}deg)`;
  });
  hologramOverlay.addEventListener('mouseleave', () => {
    hologramCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
  });
}

// 4. KONAMI CODE
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiPosition = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiPosition]) {
    konamiPosition++;
    if (konamiPosition === konamiCode.length) {
      activateKonami();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});

function activateKonami() {
  playBeep(200, 'square', 1.5, 0.3);
  document.body.classList.add('konami-mode');
  alert("SUPERUSER MODE ACTIVATED: Sistemas de Alerta Activos.");
}

// 5. B2B SECURE COMMS FORM
window.initiateSecureComms = function() {
  const statusMsg = document.getElementById('form-status');
  const btn = document.querySelector('.hack-submit-btn');
  const form = document.getElementById('b2b-contact-form');
  
  if(!statusMsg || !btn) return;
  
  btn.disabled = true;
  btn.innerText = "[ ENCRIPTANDO_PAYLOAD... ]";
  statusMsg.style.color = "var(--color-primary)";
  statusMsg.innerText = "> Estableciendo conexión segura vía túnel RSA-4096...";
  if(typeof playBeep === 'function') playBeep(300, 'sawtooth', 0.5);
  
  setTimeout(() => {
    statusMsg.innerText += "\n> Bypass de firewall completado.";
    if(typeof playBeep === 'function') playBeep(400, 'sawtooth', 0.2);
  }, 1000);
  
  setTimeout(() => {
    statusMsg.innerText += "\n> Transmitiendo paquete de datos...";
    if(typeof playBeep === 'function') playBeep(500, 'sawtooth', 0.2);
  }, 2000);
  
  setTimeout(() => {
    statusMsg.style.color = "#0f0";
    statusMsg.innerText = "> SYS_SUCCESS: El paquete corporativo ha sido entregado.\n> Me pondré en contacto en breve.";
    btn.innerText = "[ TRANSMISIÓN_EXITOSA ]";
    if(typeof playBeep === 'function') playBeep(800, 'sine', 0.8);
    form.reset();
  }, 3500);
};
