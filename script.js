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

// Smooth Scroll Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target);
    }
  });
});

// Preloader
const loaderCounter = document.querySelector('.loader-counter');
const loaderText = document.querySelector('.loader-text');
const loader = document.querySelector('.loader');

let count = 0;
gsap.to(loaderCounter, { opacity: 1, duration: 0.5 });
gsap.to(loaderText, { opacity: 1, duration: 0.5 });

const bootInterval = setInterval(() => {
  count += Math.floor(Math.random() * 10) + 1;
  if (count >= 100) {
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
const interactiveHoverElements = document.querySelectorAll('a, .project-panel, .hero-title, .social-btn, .bento-item, .tech-node, input, textarea, .nav-link');

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
if (heroTitle) {
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

  // Magnetic Elements
  const magneticElements = document.querySelectorAll('.nav-link, .panel-btn, .hologram-trigger, .spin-trigger-btn, .hack-submit-btn, .social-btn, .start-hack-btn');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  });

  // Parallax Hero Content
  gsap.to(".hero-title", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    y: 200,
    opacity: 0,
    ease: "none"
  });

  gsap.to(".hero-subtitle", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    y: 100,
    opacity: 0,
    ease: "none"
  });

  gsap.to(".hero-video-bg", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    },
    scale: 1.2,
    filter: "brightness(0.2)",
    ease: "none"
  });
}

// Text Reveal
const revealTextContainer = document.querySelector('.reveal-text');
if (revealTextContainer) {
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

  // Reveal Animations for Sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (section.id === 'hero') return;

    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    });
  });

  // Nav Background Change on Scroll
  const mainNav = document.querySelector('.main-nav');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      mainNav.style.background = "rgba(2, 2, 2, 0.9)";
    } else {
      mainNav.style.background = "rgba(5, 5, 5, 0.6)";
    }
  });
}

// Apple Carousel Dots Logic & Infinite Auto-Scroll
const appleCarousel = document.getElementById('apple-carousel');
const carouselDots = document.querySelectorAll('#carousel-dots .dot');

if (appleCarousel && carouselDots.length > 0) {
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
      if (index === currentIndex) {
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
  appleCarousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
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

if (startHackBtn) {
  startHackBtn.addEventListener('click', () => {
    startGame();
  });

  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      if (!isAcceptingInput) return;

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
  if (!node) return;

  node.classList.add('active');
  setTimeout(() => {
    node.classList.remove('active');
  }, 200); // quick flash
}

function checkSequence() {
  const currentIndex = playerSequence.length - 1;

  if (playerSequence[currentIndex] !== systemSequence[currentIndex]) {
    // FAIL -> End of the game
    gameOver();
    return;
  }

  if (playerSequence.length === systemSequence.length) {
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
  if (score > 0) {
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
  if (name && name.trim() !== '') {
    const board = getLeaderboard();
    board.push({ name: name.trim().substring(0, 10), score: score });
    board.sort((a, b) => b.score - a.score);
    // Keep top 10
    if (board.length > 10) board.length = 10;
    saveLeaderboard(board);
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  if (!leaderboardList) return;
  const board = getLeaderboard();
  leaderboardList.innerHTML = '';

  if (board.length === 0) {
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
if (leaderboardList) {
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
  if (e.key === 'º' || e.key === '`' || e.key === '~') {
    e.preventDefault();
    devConsole.classList.toggle('active');
    if (devConsole.classList.contains('active')) devInput.focus();
    playBeep(400, 'sawtooth', 0.2);
  }
});

if (devInput) {
  devInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = devInput.value.toLowerCase().trim();
      devInput.value = '';

      const outLine = document.createElement('div');
      outLine.textContent = '> ' + cmd;
      devOutput.appendChild(outLine);

      const response = document.createElement('div');

      if (cmd === 'help') {
        response.textContent = "Comandos: theme red, theme cyan, show cv, lang, clear, rm -rf";
      } else if (cmd === 'lang') {
        langBtn.click();
        response.textContent = "IDIOMA_CAMBIADO / LANGUAGE_CHANGED";
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

if (cvTrigger) {
  cvTrigger.addEventListener('click', () => {
    hologramOverlay.classList.add('active');
    playBeep(900, 'sine', 0.5);
  });
}
if (closeHologram) {
  closeHologram.addEventListener('click', () => {
    hologramOverlay.classList.remove('active');
  });
}
if (hologramCard) {
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
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
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
window.initiateSecureComms = function () {
  const statusMsg = document.getElementById('form-status');
  const btn = document.querySelector('.hack-submit-btn');
  const form = document.getElementById('b2b-contact-form');

  if (!statusMsg || !btn) return;

  btn.disabled = true;
  btn.innerText = "[ ENCRIPTANDO_PAYLOAD... ]";
  statusMsg.style.color = "var(--color-primary)";
  statusMsg.innerText = "> Estableciendo conexión segura vía túnel RSA-4096...";
  if (typeof playBeep === 'function') playBeep(300, 'sawtooth', 0.5);

  setTimeout(() => {
    statusMsg.innerText += "\n> Bypass de firewall completado.";
    if (typeof playBeep === 'function') playBeep(400, 'sawtooth', 0.2);
  }, 1000);

  setTimeout(async () => {
    statusMsg.innerText += "\n> Transmitiendo paquete de datos...";
    if (typeof playBeep === 'function') playBeep(500, 'sawtooth', 0.2);

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
        if (typeof playBeep === 'function') playBeep(800, 'sine', 0.8);
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
      if (typeof playBeep === 'function') playBeep(200, 'sawtooth', 1);
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
    if (isSpinning) return;
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

    if (typeof playBeep === 'function') {
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

    if (typeof playBeep === 'function') playBeep(1000, 'sine', 0.1);
    isSpinning = false;
  });
}

// Idiomas / i18n
const translations = {
  es: {
    nav_about: "[ PERFIL ]",
    nav_projects: "[ PROYECTOS ]",
    nav_services: "[ SERVICIOS ]",
    nav_contact: "[ CONTACTO ]",
    hero_title: "ALBERTTERY16",
    dev_console: "SISTEMA CIBERNÉTICO INICIADO. Escribe 'help' para ver comandos.",
    loader_text: "SYS_INITIALIZING",
    scroll_text: "SCROLL_TO_DESCEND",
    hero_subtitle: "ARCHITECT // DEVELOPER // CYBERSECURITY // GAMER",
    about_title: "INITIALIZE_PROFILE",
    about_p: "Hola, soy Albert y este es mi portfolio. <br>Me considero un desarrollador apasionado por crear experiencias digitales que desafían los estándares. No construyo simples páginas web, sino inmersiones tecnológicas diseñadas para impresionar a cualquiera que entre en una de mis webs.",
    slide1_h: "UI / UX Nativa",
    slide1_p: "Interfaces fluidas que responden al toque como si fueran cristal real.",
    slide2_h: "Ciberseguridad",
    slide2_p: "Arquitectura sólida y blindada ante cualquier amenaza externa.",
    slide3_h: "Ultra Rendimiento",
    slide3_p: "Optimizaciones a nivel de milisegundo para retención extrema.",
    cv_btn: "[ EXTRAER_CV ]",
    cv_tag: "Desarrollador Full-Stack",
    cv_edu1: "Bachillerato Científico",
    cv_edu2: "Grado Superior DAW",
    cv_close: "CERRAR",
    projects_title: "PROYECTOS",
    p1_title: "COM_GAMES",
    p1_desc: "Entorno neón inmersivo y lógica interactiva de entretenimiento clásico.",
    p2_title: "COM_STORE",
    p2_desc: "Arquitectura de menús complejos y flujo de comercio escalable.",
    p3_title: "COM_IDEAS",
    p3_desc: "Dashboard hiper-limpio para gestión y almacenamiento de ideas.",
    p4_title: "VFX_MATRIX",
    p4_desc: "Simulación de lluvia digital en tiempo real renderizada mediante canvas.",
    p5_title: "VFX_CYBERPUNK",
    p5_desc: "Arte generativo de sombras de neón inspirado en distopías Sci-Fi.",
    p6_title: "VFX_PRISMA",
    p6_desc: "Simulación de lluvia digital en tiempo real renderizada mediante canvas.",
    btn_access: "ACCEDER <i class='fas fa-arrow-right'></i>",
    tech_title: "TECH_STACK",
    tech_status: "SISTEMA EN ESPERA",
    tech_desc: "Pulsa NEXT para ver más información sobre <br>las tecnologías que utilizo.",
    services_title: "CORP_MODULES",
    s1_title: "CIBERSEGURIDAD B2B",
    s1_desc: "Auditorías, pentesting e integración de protocolos de seguridad impenetrables para infraestructura corporativa.",
    s2_title: "RENDIMIENTO EXTREMO",
    s2_desc: "Refactorización y arquitectura orientada a la máxima velocidad y retención.",
    s3_title: "DASHBOARDS CORP",
    s3_desc: "Sistemas de control logística, gestión de datos e intranets seguras.",
    s4_title: "E-COMMERCE HIGH-END",
    s4_desc: "Soluciones transaccionales inmersivas y arquitecturas escalables preparadas para ultra-rendimiento.",
    game_title: "NEURAL_DECRYPT",
    game_status: "SISTEMA BLOQUEADO",
    game_instr: "Memoriza e intercepta la secuencia de nodos infinitamente.",
    game_level: "Nivel",
    game_rank: "GLOBAL_RANKING",
    game_btn: "INICIAR",
    contact_title: "SECURE_COMMS",
    form_prompt: "> INICIAR_MENSAJE",
    form_name: "Corp_Name:",
    form_name_ph: "Nombre de empresa...",
    form_email: "Target_Email:",
    form_email_ph: "email@empresa.com",
    form_payload: "Payload_Data:",
    form_payload_ph: "Describe el objetivo estratégico...",
    form_btn: "[ ENVIAR_DATOS ]",
    footer_social: "SOCIAL_LINKS",
    footer_rights: "SISTEMA Y PORTFOLIO POR ALBERTTERY16. TODOS LOS DERECHOS RESERVADOS."
  },
  en: {
    nav_about: "[ PROFILE ]",
    nav_projects: "[ PROJECTS ]",
    nav_services: "[ SERVICES ]",
    nav_contact: "[ CONTACT ]",
    hero_title: "ALBERTTERY16",
    dev_console: "CYBERNETIC SYSTEM STARTED. Type 'help' to see commands.",
    loader_text: "SYS_INITIALIZING",
    scroll_text: "SCROLL_TO_DESCEND",
    hero_subtitle: "ARCHITECT // DEVELOPER // CYBERSECURITY // GAMER",
    about_title: "INITIALIZE_PROFILE",
    about_p: "Hi, I'm Albert and this is my portfolio. <br>I consider myself a developer passionate about creating digital experiences that defy standards. I don't build simple websites, but technological immersions designed to impress anyone who enters one of my webs.",
    slide1_h: "Native UI / UX",
    slide1_p: "Fluid interfaces that respond to touch like real glass.",
    slide2_h: "Cybersecurity",
    slide2_p: "Solid and armored architecture against any external threat.",
    slide3_h: "Ultra Performance",
    slide3_p: "Millisecond-level optimizations for extreme retention.",
    cv_btn: "[ EXTRACT_CV ]",
    cv_tag: "Full-Stack Developer",
    cv_edu1: "Scientific Baccalaureate",
    cv_edu2: "Higher Degree in Web Dev (DAW)",
    cv_close: "CLOSE",
    projects_title: "PROJECTS",
    p1_title: "COM_GAMES",
    p1_desc: "Immersive neon environment and interactive classic entertainment logic.",
    p2_title: "COM_STORE",
    p2_desc: "Complex menu architecture and scalable commerce flow.",
    p3_title: "COM_IDEAS",
    p3_desc: "Hyper-clean dashboard for idea management and storage.",
    p4_title: "VFX_MATRIX",
    p4_desc: "Real-time digital rain simulation rendered via canvas.",
    p5_title: "VFX_CYBERPUNK",
    p5_desc: "Generative neon art inspired by Sci-Fi dystopias.",
    p6_title: "VFX_PRISMA",
    p6_desc: "Real-time digital rain simulation rendered via canvas.",
    btn_access: "ACCESS <i class='fas fa-arrow-right'></i>",
    tech_title: "TECH_STACK",
    tech_status: "SYSTEM STANDBY",
    tech_desc: "Press NEXT to see more information about <br>the technologies I use.",
    services_title: "CORP_MODULES",
    s1_title: "B2B CYBERSECURITY",
    s1_desc: "Audits, pentesting and integration of impenetrable security protocols for corporate infrastructure.",
    s2_title: "ULTRA PERFORMANCE",
    s2_desc: "Refactoring and architecture oriented towards maximum speed and retention.",
    s3_title: "CORP DASHBOARDS",
    s3_desc: "Logistics control systems, data management and secure intranets.",
    s4_title: "HIGH-END E-COMMERCE",
    s4_desc: "Immersive transactional solutions and scalable architectures prepared for ultra-performance.",
    game_title: "NEURAL_DECRYPT",
    game_status: "SYSTEM LOCKED",
    game_instr: "Memorize and intercept the node sequence infinitely.",
    game_level: "Level",
    game_rank: "GLOBAL_RANKING",
    game_btn: "START",
    contact_title: "SECURE_COMMS",
    form_prompt: "> START_MESSAGE",
    form_name: "Corp_Name:",
    form_name_ph: "Company name...",
    form_email: "Target_Email:",
    form_email_ph: "email@company.com",
    form_payload: "Payload_Data:",
    form_payload_ph: "Describe the strategic objective...",
    form_btn: "[ SEND_DATA ]",
    footer_social: "SOCIAL_LINKS",
    footer_rights: "SYSTEM AND PORTFOLIO BY ALBERTTERY16. ALL RIGHTS RESERVED."
  }
};

let currentLang = 'es';
const langBtn = document.getElementById('lang-btn');

if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    langBtn.innerText = currentLang === 'es' ? '[ EN ]' : '[ ES ]';
    updateLanguage();
  });
}

function updateLanguage() {
  // Translate standard text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.innerHTML = translations[currentLang][key];
      // If it's a glitch element, update data-text for CSS
      if (el.classList.contains('glitch-mega')) {
        el.setAttribute('data-text', el.innerText);
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[currentLang][key]) {
      el.placeholder = translations[currentLang][key];
    }
  });

  // Re-init text reveal effect to prevent breakage
  initTextReveal();

  // Refresh ScrollTrigger to account for new text heights
  if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
    ScrollTrigger.refresh();
  }
}

// Function to (re)initialize text reveal spans
function initTextReveal() {
  const revealTextContainer = document.querySelector('.reveal-text');
  if (revealTextContainer) {
    // We get the clean text from translations to avoid nesting spans
    const textToReveal = translations[currentLang].about_p;
    revealTextContainer.innerHTML = '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textToReveal;

    tempDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/\s+/);
        words.forEach(word => {
          if (word.trim() !== '') {
            const span = document.createElement('span');
            span.classList.add('word');
            span.textContent = word + ' ';
            revealTextContainer.appendChild(span);
          }
        });
      } else if (node.nodeName === 'BR') {
        revealTextContainer.appendChild(document.createElement('br'));
      }
    });

    // Re-run animation reveal with ScrollTrigger
    gsap.to(revealTextContainer.querySelectorAll('.word'), {
      scrollTrigger: {
        trigger: ".reveal-text",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      opacity: 1,
      y: 0,
      color: "#fff",
      textShadow: "0 0 10px rgba(255,255,255,0.8)",
      stagger: 0.05,
      duration: 0.5
    });
  }
}
