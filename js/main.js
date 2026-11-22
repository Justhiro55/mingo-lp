// mingo LP。フラミンゴと羽根の絵は、アプリ（Shared/FlamingoArt.swift, FeatherArt.swift）と同じ線と色の決め方。
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // mingo の8色（アプリの InkColor.choices と同じ）
  const COLORS = [
    { name: "コーラル", hex: "#FF737D", word: "フラミンゴらしいピンク" },
    { name: "オレンジ", hex: "#FF9B45", word: "元気で明るい" },
    { name: "レモン", hex: "#FFD34D", word: "陽気で活発" },
    { name: "ライム", hex: "#A4D95B", word: "フレッシュ" },
    { name: "ミント", hex: "#45D6A6", word: "爽やか" },
    { name: "スカイ", hex: "#39BFEA", word: "自由で軽やか" },
    { name: "ラベンダー", hex: "#A685F1", word: "優しく幻想的" },
    { name: "ベリー", hex: "#E96AB0", word: "華やか" },
  ];
  let me = COLORS[0].hex;

  // ---------------- 色の計算（OKLCh） ----------------
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const toHex = (c) => "#" + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  function lch(hex) {
    const [r, g, b] = rgb(hex).map(lin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return { L, C: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
  }
  function fromLch({ L, C, h }) {
    const A = C * Math.cos((h * Math.PI) / 180), B = C * Math.sin((h * Math.PI) / 180);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return toHex([4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(gam));
  }
  /** 色みを、食べた色の方へ deg 度まで寄せる（アプリの「消化」と同じ考え方）。 */
  function lean(from, to, deg) {
    const a = lch(from), b = lch(to);
    let d = ((b.h - a.h + 540) % 360) - 180;
    d = Math.max(-deg, Math.min(deg, d));
    return fromLch({ ...a, h: (a.h + d + 360) % 360 });
  }

  // ---------------- フラミンゴ（288×360） ----------------
  const F = {
    legBack: "M142 261.266L153 308.101L149 357.468L134 360", legFront: "M169 260L184 305.57L183 357.468L166 360",
    body: "M123.905 182.562C142.353 155.396 172.332 146.753 205.769 160.335C238.054 172.684 269.185 201.084 266.879 228.25C264.573 257.885 231.136 275.173 186.168 273.938C140.047 272.703 96.2322 256.651 95.0792 222.076C93.9261 207.258 105.456 193.675 123.905 182.562Z",
    neck: "M101 234C73 211 77 178 92 146C102 125 117 107 126 86C137 61 130 43 111 42C97 41 92 51 92 64L64 60C60 32 78 8.99999 110 9.99999C145 11 161 36 157 64C151 104 121 131 109 165C100 190 103 204 124 216L101 234Z",
    head: "M67 49C67 24 85 7 109 7C136 7 154 26 152 50C150 75 128 87 109 80C89 73 67 69 67 49Z",
    beak: "M76.8017 49.0653C69.5289 48.4625 63.5785 52.0793 60.9339 58.1074L53 70.1635L66.8843 78L80.7686 61.7242C84.7355 56.9018 83.4132 51.4765 76.8017 49.0653Z",
    beakTip: "M56.5 65C50.3176 69.9 48.7133 78.9587 52.8333 83.8954C55.5799 87.5979 59.7 88.215 61.0733 84.5125L66.3874 79.65L70 74.75L56.5 65Z",
    fan: ["M164 185C212.623 187.918 253.29 210.896 286 253.936C259.478 254.665 235.609 249.194 214.391 237.522L164 185Z",
      "M158 180C219.519 184.699 262.186 201.146 286 229.342C247.302 240.754 209.597 239.411 172.884 225.314L158 180Z",
      "M149 177C215.806 177.673 262.14 188.776 288 210.309C249.209 225.786 209.341 228.141 168.395 217.374L149 177Z",
      "M137 168.178C198.412 157.082 243.412 163.819 272 188.389C244.471 214.545 211.118 228.415 171.941 230L137 168.178Z"],
    wing: "M115.521 168.381C142.042 141.854 188.104 136.269 223 147.438C218.812 189.323 185.312 218.642 150.417 234C107.146 231.208 93.1872 200.492 115.521 168.381Z",
  };
  let uid = 0;
  /** フラミンゴの絵の中身（<g> に入れる SVG）。base は体の色、fan は食べた色（多い順に最大4色）。 */
  function flamingoInner(base, fan = []) {
    const id = "f" + ++uid, light = mix(base, "#FFFFFF", 0.28), dark = mix(base, "#8A1F3A", 0.14);
    const plain = [mix(base, "#8A1F3A", 0.22), mix(base, "#FFFFFF", 0.18), mix(base, "#8A1F3A", 0.1), mix(base, "#FFFFFF", 0.06)];
    const leg = `fill="none" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"`;
    const grad = (n, x1, y1, x2, y2, a, b) => `<linearGradient id="${id}${n}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    return `<defs>${grad("n", 63.4, 10, 223.5, 77.2, light, dark)}${grad("h", 67, 7, 141.4, 91.5, light, dark)}${grad("w", 105, 142, 194.2, 256.4, mix(base, "#FFF4EA", 0.72), mix(base, "#FFFFFF", 0.3))}</defs>
      <path d="${F.legBack}" stroke="${dark}" ${leg}/><path d="${F.legFront}" stroke="${mix(base, "#8A1F3A", 0.05)}" ${leg}/>
      <path d="${F.body}" fill="${base}"/><path d="${F.neck}" fill="url(#${id}n)"/><path d="${F.head}" fill="url(#${id}h)"/>
      <path d="${F.beak}" fill="#FFE0B6"/><path d="${F.beakTip}" fill="#32323D"/>
      <circle cx="95" cy="41" r="6.8" fill="#24212A"/><circle cx="97" cy="39" r="1.8" fill="#fff"/>
      ${F.fan.map((d, i) => { const rank = 3 - i; return `<path d="${d}" fill="${rank < fan.length ? fan[rank] : plain[i]}"/>`; }).join("")}
      <path d="${F.wing}" fill="url(#${id}w)"/>`;
  }
  const flamingoSVG = (base, fan) => `<svg viewBox="0 0 288 366" aria-hidden="true">${flamingoInner(base, fan)}</svg>`;

  // ---------------- 羽根（159×161） ----------------
  const FE = {
    outline: "M18.5723 127.4L8.57227 92.4L17.1437 96.6L12.858 75.6L21.4294 58.8L31.4294 77L34.2866 46.2L58.5723 28L74.2866 18.2L75.7151 39.2L87.1437 11.2L120.001 2.8L158.572 0L148.572 53.2L131.429 58.8H148.572L132.858 86.8L102.858 92.4L122.858 96.6L90.0008 117.6L65.7151 119L90.0008 126L62.858 137.2L30.0008 134.4L18.5723 127.4Z",
    facets: ["M18.5723 127.4L8.57227 92.4004L22.858 107.8L31.4294 128.8L18.5723 127.4Z", "M18.5717 127.4L12.8574 75.5996L31.4289 103.6L37.1431 119L18.5717 127.4Z", "M12.8574 75.6008L21.4289 58.8008L31.4289 77.0008V103.601L12.8574 75.6008Z", "M34.2849 46.2L58.5706 28L54.2849 81.2L31.4277 103.6L34.2849 46.2Z", "M58.5709 27.9992L74.2852 18.1992L75.7137 39.1992L54.2852 81.1992L58.5709 27.9992Z", "M54.2854 81.2L58.5711 28L49.9997 103.6L37.1426 119L54.2854 81.2Z", "M75.7148 39.2008L87.1434 11.2008L120.001 2.80078L97.1434 50.4008L75.7148 39.2008Z", "M54.2852 81.1992L75.7137 39.1992L97.1423 50.3992L79.9994 69.9992L54.2852 81.1992Z", "M120 2.8L158.571 0L97.1426 50.4L120 2.8Z", "M158.571 0L148.571 53.2L97.1426 50.4L158.571 0Z", "M97.1429 50.4004L148.571 53.2004L131.429 58.8004L80 70.0004L97.1429 50.4004Z", "M80 70.0008L131.429 58.8008H148.571L105.714 75.6008L80 70.0008Z", "M148.572 58.8008L132.857 86.8008H82.8574L105.715 75.6008L148.572 58.8008Z", "M65.7148 86.8L80.0006 70L105.715 75.6L82.8577 86.8H65.7148Z", "M50 103.601L65.7143 86.8008H82.8571L102.857 92.4008L68.5714 105.001L50 103.601Z", "M102.856 92.4004L122.856 96.6004L89.9992 117.6L61.4277 116.2L68.5706 105L102.856 92.4004Z", "M49.9997 103.6L68.5711 105L61.4283 116.2L37.1426 119L49.9997 103.6Z", "M37.1429 118.999L61.4286 116.199L90 125.999L62.8571 137.199L30 134.399L37.1429 118.999Z", "M37.1429 119L62.8571 137.2L30 134.4L37.1429 119Z"],
    shaft: "M0 155.401C16.1905 133.001 35.2381 110.134 57.1429 86.8008C75.2381 67.2008 94.7619 48.5341 115.714 30.8008C92.8571 54.1341 74.7619 75.6008 61.4286 95.2008C42.381 115.734 25.7143 137.201 11.4286 159.601C5.71429 162.401 1.90476 161.001 0 155.401Z",
    light: "M2.85742 154C23.8098 126.933 51.4288 96.1329 85.7146 61.5996C65.7146 84.9329 40.0003 116.666 8.57171 156.8L2.85742 154Z",
  };
  const GRAY = { ground: [[0, "#FFFFFF"], [0.5625, "#ADACAE"]], facets: ["#636363", "#8F8696", "#B3B0B5", "#C5C0CA", "#8F8696", "#918E92", "#C5C0CA", "#ADACAE", "#D5D5D5", "#B3B0B5", "#8F8696", "#ADACAE", "#8F8696", "#C5C0CA", "#B3B0B5", "#8F8696", "#A09CA2", "#C5C0CA", "#B3B0B5"], shaft: [[0, "#FFFFFF"], [0.451923, "#EDEDED"], [1, "#494849"]], light: "#EDEDED" };
  const LAV = { ground: [[0, "#EDC3FF"], [1, "#9E66DC"]], facets: ["#D298EF", "#BF84E8", "#DCA5F6", "#E8B8FF", "#D69CF4", "#C387EA", "#EDC9FF", "#E2B0FB", "#F2D2FF", "#BF83EA", "#AD72DE", "#CA8FF0", "#B578E5", "#D7A1F5", "#C48AEB", "#AC70DE", "#D5A0F1", "#A46ADD", "#C08BEA"], shaft: [[0, "#FFF1FF"], [0.55, "#E4CEF4"], [1, "#AF93CB"]], light: "#FAF0FF" };
  const paletteCache = {};
  /** mingo の色に合わせた羽根の色。紫の絵の1面ずつを、色みだけ回して作る。 */
  function palette(hex) {
    if (!hex) return GRAY;
    if (hex.toUpperCase() === "#A685F1") return LAV;
    if (paletteCache[hex]) return paletteCache[hex];
    const ref = lch("#A685F1"), tg = lch(hex);
    const shift = (c) => { const x = lch(c);
      return fromLch({ h: (x.h + tg.h - ref.h + 720) % 360, C: x.C * Math.min(1.5, Math.max(0.6, tg.C / Math.max(ref.C, 0.001))), L: Math.min(0.98, Math.max(0.2, x.L + 0.7 * (tg.L - ref.L))) }); };
    return (paletteCache[hex] = { ground: LAV.ground.map(([o, c]) => [o, shift(c)]), facets: LAV.facets.map(shift), shaft: LAV.shaft.map(([o, c]) => [o, shift(c)]), light: shift(LAV.light) });
  }
  function featherSVG(hex) {
    const p = palette(hex), id = "q" + ++uid;
    const g = (n, st, x1, y1, x2, y2) => `<linearGradient id="${id}${n}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
    return `<svg viewBox="-2 -2 163 165" aria-hidden="true"><defs>${g("g", p.ground, 8.57, 0, 145.23, 149.4)}${g("s", p.shaft, 0, 30.8, 129.3, 145.7)}</defs>
      <path d="${FE.outline}" fill="url(#${id}g)"/>${FE.facets.map((d, i) => `<path d="${d}" fill="${p.facets[i]}"/>`).join("")}
      <path d="${FE.shaft}" fill="url(#${id}s)"/><path d="${FE.light}" fill="${p.light}" opacity=".66"/></svg>`;
  }
  const shadeSVG = () => `<svg class="shade" viewBox="-2 -2 163 165" aria-hidden="true"><path d="${FE.outline}"/><path d="${FE.shaft}"/></svg>`;

  // ---------------- ロゴ：アプリの起動画面と同じ動き ----------------
  // 文字（m・i・ng・o）が左から0.1秒おきに弾んで出て、羽根がゆれながら落ちて i に乗る。
  const spring = (r, z) => { const w = (2 * Math.PI) / r, wd = w * Math.sqrt(1 - z * z);
    return (t) => 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t)); };
  const sample = (dur, fn, n = Math.ceil(dur * 60)) => Array.from({ length: n + 1 }, (_, k) => fn((k / n) * dur));
  function logo() {
    const el = $("#logo");
    const pcs = [["LogoM", 212, 455, 190, 181], ["LogoI", 402, 459, 50, 177], ["LogoNG", 452, 455, 247, 181], ["LogoO", 699, 455, 134, 181]].map(([n, x, y, w, h]) => {
      const d = document.createElement("span"); d.className = "pc";
      d.style.cssText = `left:${((x - 212) / 621) * 100}%;top:${((y - 395) / 241) * 100}%;width:${(w / 621) * 100}%;height:${(h / 241) * 100}%`;
      d.innerHTML = `<img src="assets/logo/${n}.png" alt="">`; el.append(d); return d; });
    const fe = Object.assign(document.createElement("img"), { className: "fe", src: "assets/logo/LogoFeather.png", alt: "" }); el.append(fe);
    if (reduce || !el.animate) return;
    const T0 = 250, pop = spring(0.42, 0.52), opt = (delay, duration) => ({ delay, duration, fill: "both", easing: "linear" });
    pcs.forEach((p, k) => {
      p.animate(sample(1, (t) => { const v = pop(t); return { transform: `translateY(${(1 - v) * 14.4}%) scale(${0.35 + 0.65 * v})` }; }), opt(T0 + k * 100, 1000));
      p.animate([{ opacity: 0 }, { opacity: 1 }], opt(T0 + k * 100, 140));
    });
    // 羽根：0.72秒で落ちる。左右のゆれは、だんだん小さくなる（26° → −16° → 8° → 0°）
    const TF = T0 + 400 + 200, ease = (a, b, u) => a + (b - a) * (0.5 - Math.cos(Math.PI * Math.min(1, Math.max(0, u))) / 2), settle = spring(0.3, 0.55);
    const rot = (t) => (t < 0.24 ? ease(-48, 26, t / 0.24) : t < 0.48 ? ease(26, -16, (t - 0.24) / 0.24) : t < 0.72 ? ease(-16, 8, (t - 0.48) / 0.24) : 8 * (1 - settle(t - 0.72)));
    fe.animate(sample(1.3, (t) => ({ transform: `translateY(${ease(-337, 0, t / 0.72)}%) rotate(${rot(t)}deg)` })), opt(TF, 1300));
    fe.animate([{ opacity: 0 }, { opacity: 1 }], opt(TF, 200));
    // 羽根が乗る瞬間に、i が少しへこんで戻る
    const back = spring(0.3, 0.4), img = $("img", pcs[1]);
    img.animate(sample(0.8, (t) => ({ transform: `scaleY(${t < 0.08 ? 1 - 0.1 * (t / 0.08) : 0.9 + 0.1 * back(t - 0.08)})` })), opt(TF + 720, 800));
  }

  // ---------------- 色をえらぶ ----------------
  const bird = $("#bird"), listeners = [];
  function setColor(hex, animate = true) {
    me = hex;
    const c = COLORS.find((x) => x.hex === hex);
    document.documentElement.style.setProperty("--me", hex);
    $("#picked-name").textContent = c.name; $("#picked-word").textContent = c.word;
    bird.innerHTML = flamingoSVG(hex);
    if (animate) { bird.classList.remove("pop"); void bird.offsetWidth; bird.classList.add("pop"); }
    listeners.forEach((f) => f());
  }
  function swatches() {
    $("#swatches").innerHTML = COLORS.map((c, i) => `<label class="sw" style="--c:${c.hex}"><input type="radio" name="color" value="${c.hex}" aria-label="${c.name}"${i ? "" : " checked"}><span></span></label>`).join("");
    $("#swatches").addEventListener("change", (e) => setColor(e.target.value));
  }

  // ---------------- 歩く：スクロールが、歩いた距離になる ----------------
  function walk() {
    const track = $("#walk-track"), route = $("#route"), glow = $("#route-glow"), walker = $("#walker");
    const steps = [...document.querySelectorAll(".walk-steps li")], turfEls = [$("#turf-a"), $("#turf-b")];
    const D = "M188 700 L182 600 Q181 583 198 580 L372 555 Q389 552 390 535 L399 338 Q400 321 383 322 L186 341 Q169 343 168 326 L163 228 Q162 211 179 210 L330 203";
    route.setAttribute("d", D); glow.setAttribute("d", D);
    const len = route.getTotalLength();
    // それぞれの陣地に、道のどこで入るか（道のりの割合）
    const enter = turfEls.map((t) => { const cx = +t.getAttribute("cx"), cy = +t.getAttribute("cy"), r = +t.getAttribute("r") * 0.85;
      for (let i = 0; i <= 400; i++) { const p = route.getPointAtLength((len * i) / 400); if (Math.hypot(p.x - cx, p.y - cy) < r) return i / 400 + 0.03; }
      return 2; });
    let turfs = [], state = "", dir = 1, ticking = false;
    const pickTurfs = () => { turfs = ["#45D6A6", "#FFD34D", "#39BFEA", "#A685F1"].filter((c) => c !== me).slice(0, 2);
      turfEls.forEach((t, i) => t.setAttribute("fill", turfs[i])); state = ""; };
    function draw() {
      ticking = false;
      const r = track.getBoundingClientRect(), vh = innerHeight;
      const narrow = innerWidth <= 860; // 狭い画面では地図が上に貼りつくので、最後の説明が地図の下に出たところで歩き終える
      const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / (r.height - vh * (narrow ? -0.45 : 0.25))));
      route.style.strokeDashoffset = glow.style.strokeDashoffset = 1 - p;
      const a = route.getPointAtLength(len * p), b = route.getPointAtLength(Math.min(len, len * p + 2));
      if (Math.abs(b.x - a.x) > 0.6) dir = b.x > a.x ? -1 : 1; // 絵は左向き。右へ進むときは裏返す
      const eaten = turfs.filter((_, i) => p >= enter[i]);
      const body = p > 0.94 && eaten.length ? lean(me, eaten[0], 28) : me; // おでかけのあと、食べた色の方へ少し染まる
      const key = me + eaten.join() + body;
      if (key !== state) {
        state = key;
        walker.innerHTML = `<g id="walker-in">${flamingoInner(body, eaten)}</g>`;
        turfEls.forEach((t, i) => { const got = p >= enter[i]; t.style.opacity = got ? 0.2 : ""; });
        $("#stat-eat").textContent = eaten.length;
        $("#map-feathers").innerHTML = [me, ...eaten].map(featherSVG).join("");
      }
      $("#walker-in").setAttribute("transform", `translate(${a.x.toFixed(1)} ${(a.y + 6).toFixed(1)}) scale(${0.32 * dir} 0.32) translate(-152 -360)`);
      $("#stat-road").textContent = Math.round(p * 100);
      const mid = vh * (narrow ? 0.72 : 0.55); let best = 0, bd = 1e9;
      steps.forEach((s, i) => { const q = s.getBoundingClientRect(), d = Math.abs((q.top + q.bottom) / 2 - mid); if (d < bd) { bd = d; best = i; } });
      steps.forEach((s, i) => s.classList.toggle("on", i === best));
    }
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
    addEventListener("scroll", req, { passive: true }); addEventListener("resize", req);
    listeners.push(() => { pickTurfs(); draw(); });
    pickTurfs(); draw();
  }

  // ---------------- 羽根のコレクション ----------------
  function feathers() {
    const grid = $("#fe-grid"), all = [...COLORS, { name: "グレー", hex: null, word: "色が抜けきったとき" }], open = new Set();
    // ひらいているのは、はじまりの色（いまえらんでいる色）と、自分でひらいた色
    const isOpen = (c) => c.hex === me || open.has(c.hex);
    const count = () => { $("#fe-n").textContent = all.filter(isOpen).length; };
    const paint = (li, c, fresh) => {
      const on = isOpen(c), b = $("button", li);
      b.innerHTML = (on ? featherSVG(c.hex) : shadeSVG()) + `<span>${c.name}</span><small>${on ? (c.hex === me ? "はじまりの羽根" : c.word) : "まだ"}</small>`;
      b.disabled = on; b.classList.toggle("open", on);
      b.setAttribute("aria-label", on ? `${c.name}の羽根` : `${c.name}の羽根をひらく`);
      if (fresh) { b.classList.add("reveal");
        for (let k = 0; k < 12; k++) { const s = document.createElement("i"), a = (k / 12) * Math.PI * 2; s.className = "spark";
          s.style.setProperty("--dx", `${Math.cos(a) * 64}px`); s.style.setProperty("--dy", `${Math.sin(a) * 64}px`); b.append(s); setTimeout(() => s.remove(), 700); } }
    };
    all.forEach((c) => { const li = document.createElement("li");
      li.innerHTML = `<button class="fe" type="button" style="--c:${c.hex || "#ADACAE"}"></button>`; grid.append(li); paint(li, c);
      $("button", li).addEventListener("click", () => { const b = $("button", li);
        const done = () => { open.add(c.hex); b.classList.remove("charge"); paint(li, c, !reduce); count(); };
        if (reduce) return done();
        b.classList.add("charge"); setTimeout(done, 350); }); // ためる → はじける → 現れる
    });
    listeners.push(() => { [...grid.children].forEach((li, i) => paint(li, all[i])); count(); });
    count();
  }

  // ---------------- 8色の帯（見えたら一度だけ伸びる） ----------------
  function ribbons() {
    const svg = $("#ribbons");
    svg.innerHTML = COLORS.map((c, k) => `<path pathLength="1" stroke="${c.hex}" stroke-width="31" style="transition-delay:${k * 70}ms" d="M -40 ${150 + k * 30} C 380 ${20 + k * 30}, 820 ${330 + k * 30}, 1480 ${90 + k * 30}"/>`).join("");
    if (!("IntersectionObserver" in window)) return svg.classList.add("in");
    new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { svg.classList.add("in"); o.disconnect(); } }), { threshold: 0.35 }).observe(svg);
  }

  logo(); swatches(); walk(); feathers(); ribbons(); setColor(me, false);
})();
