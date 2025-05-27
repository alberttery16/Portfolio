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



// "Estilo matrix"
  const canvas = document.querySelector(".matrix-bg");
  const ctx = canvas.getContext("2d");

  function resizeMatrix() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeMatrix();
  window.addEventListener("resize", resizeMatrix);

  const katakana = "アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン";
  const letters = katakana.split("");
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffcc";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  setInterval(drawMatrix, 33);

