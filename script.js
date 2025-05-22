// Activar ScrollTrigger con GSAP para animar elementos al hacer scroll

gsap.registerPlugin(ScrollTrigger);

gsap.from(".section-title", {
  scrollTrigger: ".section-title",
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

gsap.from(".section-text", {
  scrollTrigger: ".section-text",
  y: 50,
  opacity: 0,
  duration: 1.2,
  delay: 0.3,
  ease: "power2.out"
});

// Hero desvaneciéndose al hacer scroll
gsap.to("#overlay-text", {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  opacity: 0,
  y: -100
});

gsap.to("#bg-video", {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  opacity: 0.2,
  scale: 1.1
});

// "Sobre mí" aparece suave desde abajo
gsap.from("#content", {
  scrollTrigger: {
    trigger: "#content",
    start: "top 80%",
    toggleActions: "play none none none"
  },
  opacity: 0,
  y: 100,
  duration: 1.5,
  ease: "power2.out"
});
