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
