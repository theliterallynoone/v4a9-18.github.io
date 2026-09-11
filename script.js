const CONTENT = {


  boot: {
    subjectName: "Adi",
    statusLine: "STATUS: annoyingly likable",
  },

  gate: {
    subtitle: "an unnecessarily elaborate birthday project",
    footnote: "so this is what you do with your precious hours on Earth. Welcome..",
  },

  // ---- celebration screen ---------------------------------------------------
  celebration: {
    kicker: "FILE DECRYPTED",
    
    name: "",
    title: "Happy Birthday",
    subheading: "one more trip around the sun lmao.",
    celebrateLabel: "celebrate again",
  },

  // ---- envelope ---------------------------------------------------------
  envelope: {
    hintClosed: "tap to open",
    hintOpen: "tap to close",
    message: "So i guess ill just keep this short and simple and sarcastic, because i can never keep it sweet haha. I really wanted to use AI for this message as well, but then i realised my writing skills are on the verge of death. Anyway, i know things have been really weird between us (when were they not honestly speaking), and whatever happens or happened, you're probably the only person on earth i would actually love to take some advice or share things to, even if your response might be '3 din ka suspension nai chutti hoti h beti'.\n Yeah um Happy birthday one of my favourite human beings on this planet.\n(Also yes, i kinda vibe coded this thing but who cares right? If it makes you feel any better claude was annoying as fuck.)\n Happy 18th <3",
  },
};


// ============================================================================
// 2. BOOT SEQUENCE
// ============================================================================

const BOOT_LINES = [
  { text: "INITIALIZING V4A9...", type: "ok" },
  { text: "ESTABLISHING SECURE CONNECTION...", type: "ok" },
  { text: "DECRYPTING FILE HEADER...", type: "ok" },
  { text: `SUBJECT IDENTIFIED: ${CONTENT.boot.subjectName}`, type: "ok" },
  { text: "AGE: 18", type: "ok" },
  { text: CONTENT.boot.statusLine.toUpperCase(), type: "warn" },
  { text: "ACCESS LEVEL: Unemployed behavior", type: "warn" },
  { text: "LOADING FILE...", type: "ok" },
];

function runBoot() {
  const log = document.getElementById("bootLog");
  const bar = document.getElementById("bootBar");
  const bootEl = document.getElementById("boot");
  const skipBtn = document.getElementById("skipBoot");

  let i = 0;
  let finished = false;
  let timer = null;

  function printNext() {
    if (i >= BOOT_LINES.length) {
      finished = true;
      finishBoot();
      return;
    }
    const line = BOOT_LINES[i];
    const span = document.createElement("div");
    span.className = line.type === "warn" ? "line-warn" : "line-ok";
    span.textContent = line.text;
    log.appendChild(span);
    bar.style.width = `${Math.round(((i + 1) / BOOT_LINES.length) * 100)}%`;
    i++;
    timer = setTimeout(printNext, 260 + Math.random() * 220);
  }

  function finishBoot() {
    if (timer) clearTimeout(timer);
    bootEl.classList.add("boot-hide");
    setTimeout(() => {
      bootEl.hidden = true;
      showGate();
    }, 550);
  }

  skipBtn.addEventListener("click", () => {
    if (!finished) finishBoot();
  });

  printNext();
}


// ============================================================================
// 3. GATE / ENTRY
// ============================================================================

function showGate() {
  window.__v4a9Ready = true; // tell the inline failsafe script we're fine, no need to intervene
  const gate = document.getElementById("gate");
  document.getElementById("gateSubtitle").textContent = CONTENT.gate.subtitle;
  document.querySelector(".gate-footnote").textContent = CONTENT.gate.footnote;
  gate.hidden = false;

  document.getElementById("enterBtn").addEventListener("click", enterSite, { once: true });
}

function enterSite() {
  const gate = document.getElementById("gate");
  gate.classList.add("gate-hide");
  setTimeout(() => {
    gate.hidden = true;
    const site = document.getElementById("site");
    site.hidden = false;
    site.classList.add("site-in");
    initSite();
  }, 480);
}


// ============================================================================
// 4. CELEBRATION
// ============================================================================

function renderCelebration() {
  const c = CONTENT.celebration;
  document.getElementById("celKicker").textContent = c.kicker;
  document.getElementById("celTitle").textContent = c.name ? `${c.title}, ${c.name}` : c.title;
  document.getElementById("celSub").textContent = c.subheading;
  document.getElementById("celebrateBtn").textContent = c.celebrateLabel;
}

function initCelebrateButton() {
  const btn = document.getElementById("celebrateBtn");
  const layer = document.getElementById("confettiLayer");
  btn.addEventListener("click", () => burstConfetti(layer));
}

const CONFETTI_COLORS = ["#E8A33D", "#F2597F", "#4FD8C4", "#B694F5", "#F5E9DA"];

function burstConfetti(container, count = 140) {
  if (!container) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = 6 + Math.random() * 6;
    el.style.background = color;
    el.style.width = `${size}px`;
    el.style.height = `${size * 1.6}px`;

    const startX = Math.random() * w;
    const drift = Math.random() * 300 - 150;
    const rotateStart = Math.random() * 360;
    const rotateEnd = rotateStart + (Math.random() * 720 - 360);
    const duration = 2200 + Math.random() * 1800;
    const delay = Math.random() * 250;

    el.style.left = `${startX}px`;

    container.appendChild(el);

    const anim = el.animate(
      [
        { transform: `translate(0px, 0px) rotate(${rotateStart}deg)`, opacity: 1 },
        { transform: `translate(${drift}px, ${h + 40}px) rotate(${rotateEnd}deg)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${drift}px, ${h + 40}px) rotate(${rotateEnd}deg)`, opacity: 0 },
      ],
      { duration, delay, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" }
    );

    anim.onfinish = () => el.remove();
  }
}

function initEnvelope() {
  const btn = document.getElementById("envelopeBtn");
  const hint = document.getElementById("envelopeHint");
  const msg = document.getElementById("envelopeMessage");
  const backdrop = document.getElementById("envelopeBackdrop");

  msg.textContent = CONTENT.envelope.message;
  hint.textContent = CONTENT.envelope.hintClosed;

  function setOpen(isOpen) {
    btn.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    hint.textContent = isOpen ? CONTENT.envelope.hintOpen : CONTENT.envelope.hintClosed;
  }

  btn.addEventListener("click", () => setOpen(!btn.classList.contains("open")));
  backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.classList.contains("open")) setOpen(false);
  });
}


// ============================================================================
// 5. INIT
// ============================================================================

function initSite() {
  safeRun(renderCelebration);
  safeRun(initCelebrateButton);
  safeRun(initEnvelope);

  // greet with one automatic burst on arrival — the single orchestrated
  // moment. Every burst after this is user-triggered via the button.
  setTimeout(() => {
    const layer = document.getElementById("confettiLayer");
    safeRun(() => burstConfetti(layer));
  }, 350);
}

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.error(`V4A9: ${fn.name || "anonymous"} failed:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    runBoot();
  } catch (err) {
    console.error("V4A9 failed to start boot sequence:", err);
    // let the inline failsafe in index.html take over instead of hanging forever
  }
});
