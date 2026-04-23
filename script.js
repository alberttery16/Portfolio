// Smooth Scrolling
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

// Preloader
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

// Custom Cursor
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

// Hero Effects
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

// Text Reveal
const revealTextContainer = document.querySelector('.reveal-text');
if(revealTextContainer) {
  // Save innerHTML to preserve <br>
  const originalHTML = revealTextContainer.innerHTML;
  revealTextContainer.innerHTML = '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;
  
  tempDiv.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/\s+/);
      words.forEach(word => {
        if (word.trim() !== '') {
          const span = document.createElement('span');
          span.classList.add('word');
          span.innerText = word;
          revealTextContainer.appendChild(span);
        }
      });
    } else {
      revealTextContainer.appendChild(node.cloneNode(true));
    }
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

  // Parallax para los fondos dinámicos (Aurora)
  gsap.to('.blob-1', {
    scrollTrigger: { scrub: 1.5 },
    y: 300,
    ease: "none"
  });
  
  gsap.to('.blob-2', {
    scrollTrigger: { scrub: 2 },
    y: -250,
    x: -100,
    ease: "none"
  });

  gsap.to('.blob-3', {
    scrollTrigger: { scrub: 1 },
    y: 150,
    scale: 1.5,
    ease: "none"
  });
}

// Apple Carousel Dots Logic & Infinite Auto-Scroll
const appleCarousel = document.getElementById('apple-carousel');
const carouselDots = document.querySelectorAll('#carousel-dots .dot');

if(appleCarousel && carouselDots.length > 0) {
  let currentIndex = 0;
  const totalRealSlides = carouselDots.length;

  // Clonar el primer slide al final para el efecto de bucle infinito
  const firstSlideClone = appleCarousel.children[0].cloneNode(true);
  appleCarousel.appendChild(firstSlideClone);

  let isJumping = false;

  const updateDots = () => {
    if (isJumping) return;
    
    const slideWidth = appleCarousel.clientWidth;
    const scrollPos = appleCarousel.scrollLeft;
    let newIndex = Math.round(scrollPos / slideWidth);

    // Si hemos llegado al clon (el último elemento simulando ser el primero)
    if (newIndex >= totalRealSlides) {
      isJumping = true;
      // Desactivamos el smooth scrolling nativo temporalmente
      appleCarousel.style.scrollBehavior = 'auto';
      appleCarousel.style.scrollSnapType = 'none';
      
      // Saltamos instantáneamente al slide 0 real
      appleCarousel.scrollTo({ left: 0, behavior: 'auto' });
      
      // Restauramos el comportamiento normal
      setTimeout(() => {
        appleCarousel.style.scrollBehavior = 'smooth';
        appleCarousel.style.scrollSnapType = 'x mandatory';
        isJumping = false;
      }, 50);
      
      newIndex = 0;
    }

    currentIndex = newIndex;
    
    carouselDots.forEach((dot, index) => {
      if(index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  appleCarousel.addEventListener('scroll', updateDots);

  let autoScrollInterval;

  const startAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      currentIndex++;
      const slideWidth = appleCarousel.clientWidth;
      
      appleCarousel.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });
    }, 5000);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  // Iniciar el auto-scroll
  startAutoScroll();

  // Pausar auto-scroll al interactuar y REANUDAR al dejar de interactuar
  appleCarousel.addEventListener('mouseenter', stopAutoScroll);
  appleCarousel.addEventListener('mouseleave', startAutoScroll);
  appleCarousel.addEventListener('touchstart', stopAutoScroll, {passive: true});
  appleCarousel.addEventListener('touchend', startAutoScroll);
}

// Minigame Logic
const simonNodes = document.querySelectorAll('.simon-node');
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

// Ranking
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

// Animaciones y utilidades
// 1. Audio
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

// 2. Consola Dev
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
        response.textContent = "Comandos: theme red, theme cyan, show cv, clear, rm -rf";
      } else if (cmd === 'theme red') {
        document.documentElement.style.setProperty('--color-primary', '#ff0000');
        response.textContent = "Tema cambiado a ROJO TÁCTICO.";
      } else if (cmd === 'theme cyan') {
        document.documentElement.style.setProperty('--color-primary', '#00f3ff');
        response.textContent = "Tema restaurado.";
      } else if (cmd === 'clear') {
        devOutput.innerHTML = '';
      } else if (cmd === 'show cv') {
        response.textContent = "INICIANDO DESCARGA HOLOGRÁFICA...";
        document.getElementById('hologram-overlay').classList.add('active');
        devConsole.classList.remove('active');
      } else if (cmd === 'rm -rf') {
        response.textContent = "CRITICAL ERROR: PURGA DE SISTEMA INICIADA...";
        response.style.color = 'red';
        
        let beeps = 0;
        let beepInterval = setInterval(() => {
          if (typeof playBeep === 'function') playBeep(200 + (beeps * 100), 'sawtooth', 0.1, 0.5);
          beeps++;
          if (beeps >= 6) clearInterval(beepInterval);
        }, 250);

        setTimeout(() => {
           document.body.classList.add('system-destroyed');
           
           setTimeout(() => {
             document.body.className = '';
             document.body.innerHTML = '<div style="color:red;font-family:monospace;font-size:2rem;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;text-align:center;">[ KERNEL CRITICAL ERROR ]<br><br>SISTEMA DESTRUIDO.<br>POR FAVOR, REINICIA EL NAVEGADOR.</div>';
           }, 2500);
        }, 1500);
      } else {
        response.textContent = "Comando no reconocido.";
      }
      devOutput.appendChild(response);
      devOutput.scrollTop = devOutput.scrollHeight;
    }
  });
}

// 3. Holograma
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

// 4. Comandos Secretos
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

// 5. Formularios
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
  
  setTimeout(async () => {
    statusMsg.innerText += "\n> Transmitiendo paquete de datos...";
    if(typeof playBeep === 'function') playBeep(500, 'sawtooth', 0.2);
    
    try {
      const formData = new FormData(form);
      // FORMULARIO DE CONTACTO MEDIANTE LA HERRAMIENTA FORMSPREE
      const response = await fetch("https://formspree.io/f/xbdqzenr", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusMsg.style.color = "#0f0";
        statusMsg.innerText += "\n> SYS_SUCCESS: El paquete corporativo ha sido entregado.\n> Me pondré en contacto en breve.";
        btn.innerText = "[ TRANSMISIÓN_EXITOSA ]";
        if(typeof playBeep === 'function') playBeep(800, 'sine', 0.8);
        form.reset();
        setTimeout(() => { btn.disabled = false; btn.innerText = "[ ENVIAR_DATOS ]"; }, 5000);
      } else {
        throw new Error("API devuelta con error");
      }
    } catch (error) {
      statusMsg.style.color = "#f00";
      statusMsg.innerText += "\n> SYS_ERROR: Destino inalcanzable o bloqueado. Intenta contacto manual por Email.";
      btn.innerText = "[ REINTENTAR ]";
      btn.disabled = false;
      if(typeof playBeep === 'function') playBeep(200, 'sawtooth', 1);
    }
  }, 2000);
};

// Tech Stack Interactivo
const techOrbit = document.getElementById('tech-orbit');
const techNodes = document.querySelectorAll('.tech-node');
const spinBtn = document.getElementById('spin-btn');
const techInfoTitle = document.getElementById('tech-info-title');
const techInfoDesc = document.getElementById('tech-info-desc');

if (techOrbit && techNodes.length > 0 && spinBtn) {
  const radius = 140; // reduced slightly to fit 80px nodes in 400px container
  const totalNodes = techNodes.length;
  let currentRotation = 0;
  let currentTechIndex = -1;
  let isSpinning = false;
  
  // Initialize positions
  techNodes.forEach((node, index) => {
    const angle = (index / totalNodes) * (2 * Math.PI) - (Math.PI / 2); // Top is -90deg
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    node.style.left = `calc(50% + ${x}px)`;
    node.style.top = `calc(50% + ${y}px)`;
    node.style.transform = `translate(-50%, -50%) rotate(0deg)`;
  });
  
  spinBtn.addEventListener('click', () => {
    if(isSpinning) return;
    isSpinning = true;
    
    // Remove active state
    techNodes.forEach(n => n.classList.remove('active'));
    
    // Sequential selection
    const stepAngle = 360 / totalNodes;
    
    // We increment index. First click goes to index 1 if we start assuming index 0 is top.
    // If currentTechIndex is -1 (start), first target is 0. But 0 is already at top. 
    // Let's just always rotate by stepAngle and highlight the new top.
    currentTechIndex = (currentTechIndex === -1 ? 1 : currentTechIndex + 1) % totalNodes;
    const targetIndex = currentTechIndex;
    
    // Instead of random huge spin, just advance by one node precisely
    currentRotation = currentRotation - stepAngle;
    
    if(typeof playBeep === 'function') {
      playBeep(600, 'square', 0.05, 0.05);
      setTimeout(() => playBeep(800, 'square', 0.05, 0.05), 100);
    }
    
    // Apply transforms directly (bypassing animation)
    techOrbit.style.transform = `rotate(${currentRotation}deg)`;
    techNodes.forEach(node => {
      node.style.transform = `translate(-50%, -50%) rotate(${-currentRotation}deg)`;
    });

    const activeNode = techNodes[targetIndex];
    activeNode.classList.add('active');
    
    const tooltipRaw = activeNode.getAttribute('data-tooltip') || "INFO: NO DATA";
    const parts = tooltipRaw.split(':');
    
    if (parts.length > 1) {
      techInfoTitle.innerText = parts[0].trim();
      techInfoDesc.innerText = parts.slice(1).join(':').trim();
    } else {
      techInfoTitle.innerText = "TECH_NODE";
      techInfoDesc.innerText = tooltipRaw;
    }
    
    if(typeof playBeep === 'function') playBeep(1000, 'sine', 0.1);
    isSpinning = false;
  });
}

