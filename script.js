// ============================================================================
// V4A9-18 — script.js
// ============================================================================
//
// HOW THIS FILE IS ORGANIZED
// 1. PERSONAL CONTENT — EDIT THIS   <- almost everything you'll ever touch
// 2. Boot sequence logic
// 3. Gate / entry logic
// 4. Renderers (profile, archive, incidents, stats, timeline)
// 5. Terminal + easter egg
// 6. Small utilities (scroll reveal, sound toggle)
//
// You should only need to edit section 1. Everything below it reads from
// these objects/arrays automatically.
// ============================================================================


// ============================================================================
// 1. PERSONAL CONTENT — EDIT THIS
// ============================================================================

const CONTENT = {

  // ---- shown briefly during the boot sequence -----------------------------
  boot: {
    subjectName: "SUBJECT",              // e.g. his name or nickname
    statusLine: "STATUS: annoyingly likable", // the "something funny" line
  },

  // ---- landing gate ---------------------------------------------------------
  gate: {
    subtitle: "an unnecessarily elaborate birthday project",
    footnote: "you were not supposed to find this link. since you did — sit down.",
  },

  // ---- /PROFILE ---------------------------------------------------------
  profile: {
    heading: "SUBJECT PROFILE",
    name: "—",                 // his name
    alias: "—",                 // nickname(s), comma separated
    age: "18",
    status: "—",                 // e.g. "active", "impossible to buy gifts for"
    threat: "—",                 // a funny "threat level"
    note: "Replace this with two or three dry, specific sentences about him — " +
          "something only you'd know how to describe. Avoid generic compliments; " +
          "be weirdly specific instead.",
  },

  // ---- /ARCHIVE — memory entries -----------------------------------------
  // Add/remove as many as you like. `image` can be a relative path
  // (e.g. "images/photo1.jpg") or left empty to omit the image.
  memories: [
    {
      title: "Entry title here",
      date: "MONTH YYYY",
      classification: "UNCLASSIFIED — SENTIMENTAL",
      description: "A sentence or two about what happened and why it mattered.",
      image: "", // "images/example.jpg"
    },
    {
      title: "Second entry title",
      date: "MONTH YYYY",
      classification: "RESTRICTED — EMBARRASSING",
      description: "Another memory, screenshot caption, or inside joke here.",
      image: "",
    },
  ],

  // ---- /INCIDENTS — short funny log entries --------------------------------
  incidents: [
    {
      code: "INCIDENT-001",
      text: "Describe a funny, low-stakes 'incident' here — a bit, a mishap, a running joke.",
    },
    {
      code: "INCIDENT-002",
      text: "Another one. Keep these short and punchy, one or two sentences.",
    },
    {
      code: "INCIDENT-003",
      text: "A third, if you've got one. Not required.",
    },
  ],

  // ---- /ANALYSIS — fake diagnostic stats -----------------------------------
  // value is 0-100. Label can be anything you want.
  stats: [
    { label: "CHAOS LEVEL", value: 91 },
    { label: "GOOFINESS", value: 100 },
    { label: "ABILITY TO MAKE QUESTIONABLE DECISIONS", value: 97 },
    { label: 'LIKELIHOOD OF SAYING "..." UNPROMPTED', value: 82 },
    { label: "CHARM (UNEARNED)", value: 88 },
  ],

  // the fake "compatibility scan" — final line is customizable
  compat: {
    percent: 97,
    verdict: "verdict: statistically inconclusive. proceeding anyway.",
  },

  // ---- /MEMORY_CORE — timeline ----------------------------------------------
  timeline: [
    { date: "DAY ONE", title: "How this started", desc: "Short description of the beginning." },
    { date: "SOMEWHERE IN THE MIDDLE", title: "A turning point", desc: "Describe a moment that mattered." },
    { date: "NOW", title: "Where things are", desc: "A line about the present — can be funny, can be honest." },
  ],

  // ---- /FINAL_MESSAGE ---------------------------------------------------
  finalMessage: "[INSERT MY ACTUAL MESSAGE HERE]",
  finalSign: "— end of file —",

  // ---- terminal easter egg -----------------------------------------------
  // Typing this command in the on-page terminal (section 06) unlocks the
  // overlay below. Keep it something only he'd think to try, or tell him
  // the command in person.
  easterEggCommand: "override",
  easterEgg: {
    label: "RESTRICTED FILE — UNLOCKED",
    body: "Put whatever you want here: a private joke, a photo reference, " +
          "a coupon for something, coordinates, a question. This only shows " +
          "up if the command above is typed into the terminal.",
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
  { text: "ACCESS LEVEL: ABSOLUTELY NONE OF YOUR BUSINESS", type: "warn" },
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
// 4. RENDERERS
// ============================================================================

function renderProfile() {
  const p = CONTENT.profile;
  document.getElementById("profileName").textContent = p.heading;
  document.getElementById("pf-name").textContent = p.name;
  document.getElementById("pf-alias").textContent = p.alias;
  document.getElementById("pf-age").textContent = p.age;
  document.getElementById("pf-status").textContent = p.status;
  document.getElementById("pf-threat").textContent = p.threat;
  document.getElementById("pf-note").textContent = p.note;
}

function renderArchive() {
  const list = document.getElementById("archiveList");
  list.innerHTML = "";
  CONTENT.memories.forEach((m, idx) => {
    const entry = document.createElement("div");
    entry.className = "archive-entry";

    const num = String(idx + 1).padStart(3, "0");

    entry.innerHTML = `
      <button class="archive-head" aria-expanded="false">
        <span class="archive-id">ENTRY #${num}</span>
        <span class="archive-headtitle">${escapeHTML(m.title)}</span>
        <span class="archive-date">${escapeHTML(m.date)}</span>
        <span class="archive-chevron">›</span>
      </button>
      <div class="archive-body">
        <p class="archive-class">CLASSIFICATION: ${escapeHTML(m.classification || "UNMARKED")}</p>
        <p class="archive-desc">${escapeHTML(m.description)}</p>
        ${m.image ? `<img class="archive-img" src="${m.image}" alt="${escapeHTML(m.title)}" loading="lazy">` : ""}
      </div>
    `;

    const head = entry.querySelector(".archive-head");
    head.addEventListener("click", () => {
      const isOpen = entry.classList.toggle("open");
      head.setAttribute("aria-expanded", String(isOpen));
    });

    list.appendChild(entry);
  });
}

function renderIncidents() {
  const list = document.getElementById("incidentList");
  list.innerHTML = "";
  CONTENT.incidents.forEach((inc) => {
    const el = document.createElement("div");
    el.className = "incident";
    el.innerHTML = `
      <p class="incident-code">${escapeHTML(inc.code)}</p>
      <p class="incident-text">${escapeHTML(inc.text)}</p>
    `;
    list.appendChild(el);
  });
}

function renderStats() {
  const list = document.getElementById("statList");
  list.innerHTML = "";
  CONTENT.stats.forEach((s) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <span class="stat-name">${escapeHTML(s.label)}</span>
      <span class="stat-pct">${s.value}%</span>
      <div class="stat-track"><div class="stat-fill" data-value="${s.value}"></div></div>
    `;
    list.appendChild(row);
  });

  document.getElementById("compatVerdict").textContent = CONTENT.compat.verdict;
}

function renderTimeline() {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = "";
  CONTENT.timeline.forEach((t) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <p class="timeline-date">${escapeHTML(t.date)}</p>
      <p class="timeline-title">${escapeHTML(t.title)}</p>
      <p class="timeline-desc">${escapeHTML(t.desc)}</p>
    `;
    wrap.appendChild(item);
  });
}

function renderFinal() {
  document.getElementById("finalMessage").textContent = CONTENT.finalMessage;
  document.getElementById("finalSign").textContent = CONTENT.finalSign;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}


// ============================================================================
// 5. TERMINAL + EASTER EGG
// ============================================================================

const TERMINAL_HELP = [
  "available commands:",
  "  help          — show this list",
  "  whoami        — ...",
  "  clear         — clear the screen",
  "  status        — subject status readout",
].join("\n");

function initTerminal() {
  const output = document.getElementById("termOutput");
  const input = document.getElementById("termInput");

  function print(text, cls) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  print("v4a9 local terminal — type 'help' to begin", "term-accent");

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    if (!raw) return;
    print(`v4a9> ${raw}`, "term-echo");
    input.value = "";
    handleCommand(raw.toLowerCase());
  });

  function handleCommand(cmd) {
    switch (cmd) {
      case "help":
        print(TERMINAL_HELP);
        break;
      case "clear":
        output.innerHTML = "";
        break;
      case "whoami":
        print("insufficient clearance to answer that.");
        break;
      case "status":
        print(CONTENT.profile.status || "status unknown.");
        break;
      case CONTENT.easterEggCommand.toLowerCase():
        print("override accepted. decrypting restricted file...", "term-accent");
        setTimeout(openEasterEgg, 500);
        break;
      default:
        print(`command not recognized: '${cmd}'`);
    }
  }
}

function openEasterEgg() {
  const overlay = document.getElementById("easterEgg");
  document.getElementById("eeLabel").textContent = CONTENT.easterEgg.label;
  document.getElementById("eeBody").textContent = CONTENT.easterEgg.body;
  overlay.hidden = false;
}

function initEasterEggClose() {
  document.getElementById("eeClose").addEventListener("click", () => {
    document.getElementById("easterEgg").hidden = true;
  });
}


// ============================================================================
// 6. UTILITIES — scroll reveal, sound toggle, stat bar animation
// ============================================================================

function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          // animate stat bars + compat readout once analysis section is visible
          if (entry.target.id === "analysis") {
            animateStats();
            animateCompat();
          }
        }
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((s) => io.observe(s));
}

let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  document.querySelectorAll(".stat-fill").forEach((el, i) => {
    setTimeout(() => {
      el.style.width = `${el.dataset.value}%`;
    }, i * 120);
  });
}

let compatAnimated = false;
function animateCompat() {
  if (compatAnimated) return;
  compatAnimated = true;
  const readout = document.getElementById("compatReadout");
  const target = CONTENT.compat.percent;
  let current = 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    current = Math.round(progress * target);
    readout.textContent = `${current}% MATCH`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      readout.classList.add("glitch");
    }
  }
  requestAnimationFrame(tick);
}

// simple optional ambient tone, OFF by default, no autoplay
function initSoundToggle() {
  const btn = document.getElementById("soundToggle");
  let ctx = null;
  let osc = null;
  let gain = null;
  let on = false;

  btn.addEventListener("click", () => {
    on = !on;
    btn.setAttribute("aria-pressed", String(on));
    btn.querySelector(".sound-toggle") // no-op guard
    btn.lastChild.textContent = on ? " sound: on" : " sound: off";

    if (on) {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 90;
      gain.gain.value = 0.0;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.6);
    } else if (osc && gain && ctx) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.35);
    }
  });
}


// ============================================================================
// INIT
// ============================================================================

function initSite() {
  renderProfile();
  renderArchive();
  renderIncidents();
  renderStats();
  renderTimeline();
  renderFinal();
  initTerminal();
  initEasterEggClose();
  initScrollReveal();
  initSoundToggle();
}

document.addEventListener("DOMContentLoaded", () => {
  runBoot();
});
