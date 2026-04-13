// Inicializar Particles.js (Fondo Tecnológico de Partículas)
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#00f3ff" },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5, "random": true },
      "size": { "value": 3, "random": true },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#f85a16",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      },
      "modes": {
        "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
  });
}

// Cursor Dinámico / Personalizado
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const interactives = document.querySelectorAll('a, button, .interactive-hover, .project-card, .social-icons a');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Mover el punto pequeño al instante
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Animación fluida para el anillo seguidor
  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
  });

  // Efectos Hover en elementos interactivos
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorFollower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorFollower.classList.remove('hovered');
    });
  });
}

// Inicializar VanillaTilt a los elementos que tengan el atributo si no se inició automáticamente
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
}

// --- GSAP SCROLL ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Efecto parallax invertido para la capa de texto en Hero
gsap.to(".overlay-text", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  y: 150,
  opacity: 0,
  scale: 0.9
});

gsap.to(".bg-video", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  y: 50, // Pequeño delay parallax en el vídeo
  opacity: 0.1
});

// Títulos de Sección revelados
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
});

// Textos de contenido
gsap.utils.toArray('.section-text').forEach(text => {
  gsap.from(text, {
    scrollTrigger: {
      trigger: text,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power2.out"
  });
});

// Tarjetas de Proyecto: aparición en cascada (stagger)
gsap.utils.toArray('.project-list').forEach(list => {
  const cards = list.querySelectorAll('.project-card');
  gsap.from(cards, {
    scrollTrigger: {
      trigger: list,
      start: "top 85%",
      toggleActions: "play none none none" // Entran y ya
    },
    y: 100,
    opacity: 0,
    rotationX: 15,
    duration: 0.8,
    stagger: 0.2, // aparición en cascada
    ease: "back.out(1.2)"
  });
});
