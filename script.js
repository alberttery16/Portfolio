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
const interactiveHoverElements = document.querySelectorAll('a, .project-panel, .hero-title, .social-btn');

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

const panelsWrapper = document.querySelector('.panels-wrapper');
if(panelsWrapper) {
  function getScrollAmount() {
    let panelsWidth = panelsWrapper.scrollWidth;
    return -(panelsWidth - window.innerWidth + window.innerWidth * 0.2); // extra padding
  }

  const tween = gsap.to(panelsWrapper, {
    x: getScrollAmount,
    ease: "none"
  });

  ScrollTrigger.create({
    trigger: ".horizontal-projects-section",
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true
  });
}
