/* ============================================================
   scroll-world — portable scroll-scrub engine
   Vanilla JS, zero dependencies.
   Scroll position drives camera animation through scenes.
   ============================================================ */

function mountScrollWorld(container, config) {
    const SECTIONS = config.sections || [];
    const N = SECTIONS.length;
    if (!N) return;

    // Scroll distances (in vh)
    const DIVE_SCROLL = config.diveScroll || 1.5;   // scroll per scene dive
    const CONN_SCROLL = config.connScroll || 0.6;   // scroll per crossfade
    const TOTAL_VH = N * DIVE_SCROLL + (N - 1) * CONN_SCROLL;

    // State
    let scrollY = 0;
    let ticking = false;

    // ---- Build DOM ----
    function el(tag, cls) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    }

    // Sky
    const sky = el('div', 'sw-sky');
    sky.appendChild(el('div', 'sw-sky__grad'));
    container.appendChild(sky);

    // Vignette
    container.appendChild(el('div', 'sw-vignette'));

    // Stage
    const stage = el('div', 'sw-stage');

    const scenes = [];
    SECTIONS.forEach((s, i) => {
        const scene = el('div', 'sw-scene');
        const img = el('img', 'sw-scene__still');
        img.alt = '';
        img.decoding = 'async';
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.src = s.still;
        scene.appendChild(img);
        stage.appendChild(scene);
        scenes.push({ el: scene, img, idx: i, visible: false });
    });
    container.appendChild(stage);

    // Copy layer
    const copylayer = el('div', 'sw-copylayer');
    const copies = [];
    SECTIONS.forEach((s, i) => {
        const c = el('article', 'sw-copy');
        let html = `<span class="sw-copy__num">${String(i+1).padStart(2,'0')} / ${String(N).padStart(2,'0')}</span>`;
        if (s.eyebrow) html += `<span class="sw-copy__eyebrow">${s.eyebrow}</span>`;
        if (s.title) html += `<h2 class="sw-copy__title">${s.title}</h2>`;
        if (s.body) html += `<p class="sw-copy__body">${s.body}</p>`;
        if (s.tags && s.tags.length) {
            html += `<div class="sw-copy__tags">${s.tags.map(t => `<span class="sw-copy__tag">${t}</span>`).join('')}</div>`;
        }
        if (s.cta) {
            html += `<a href="${s.cta.href || '#'}" style="display:inline-block;margin-top:2rem;padding:0.9rem 2.5rem;background:var(--sw-accent);color:#fff;border-radius:100px;text-decoration:none;font-weight:600;font-size:0.9rem;letter-spacing:1px;pointer-events:all;">${s.cta.label}</a>`;
        }
        c.innerHTML = html;
        copylayer.appendChild(c);
        copies.push(c);
    });
    container.appendChild(copylayer);

    // Scrollbar
    const scrollbar = el('div', 'sw-scrollbar');
    const scrollFill = el('span', 'sw-scrollbar__fill');
    scrollbar.appendChild(scrollFill);
    container.appendChild(scrollbar);

    // Hint
    const hint = el('div', 'sw-hint');
    hint.innerHTML = `<span>${config.hint || 'scroll para volar'}</span><div class="sw-hint__arrow"></div>`;
    container.appendChild(hint);

    // Nav dots
    if (config.nav !== false) {
        const nav = el('div', 'sw-nav');
        const dots = [];
        SECTIONS.forEach((s, i) => {
            const dot = el('button', 'sw-nav__dot');
            dot.title = s.title || '';
            dot.addEventListener('click', () => {
                const target = (i * (DIVE_SCROLL + CONN_SCROLL)) / TOTAL_VH;
                window.scrollTo({ top: target * totalHeight, behavior: 'smooth' });
            });
            nav.appendChild(dot);
            dots.push(dot);
        });
        container.appendChild(nav);
        SECTIONS._dots = dots;
    }

    // Brand
    if (config.brand) {
        const topbar = el('div', 'sw-topbar');
        topbar.innerHTML = `<a class="sw-brand" href="${config.brand.href || '#'}"><span class="sw-brand__mark"></span><span class="sw-brand__name">${config.brand.name}</span></a>`;
        container.appendChild(topbar);
    }

    // ---- Virtual scroll track ----
    const totalHeight = TOTAL_VH * window.innerHeight / 100;
    // We use a spacer approach: the body itself is the track
    // But we need to ensure it's scrollable
    document.body.style.height = `${totalHeight}px`;
    document.body.style.position = 'relative';

    // ---- Animation loop ----
    function update() {
        scrollY = window.scrollY || window.pageYOffset;
        const maxScroll = totalHeight - window.innerHeight;
        const progress = Math.min(scrollY / Math.max(maxScroll, 1), 1);

        // Scrollbar
        scrollFill.style.height = `${progress * 100}%`;

        // Hide hint after first scroll
        if (scrollY > 50) hint.classList.add('hidden');

        // Calculate which scene we're in
        // Each scene takes DIVE_SCROLL vh, connectors take CONN_SCROLL vh
        const vh = window.innerHeight;
        let accumulated = 0;
        let activeIdx = 0;
        let sceneProgress = 0; // 0..1 within current scene dive

        for (let i = 0; i < N; i++) {
            const diveStart = accumulated;
            const diveEnd = accumulated + DIVE_SCROLL * vh;
            const connEnd = (i < N - 1) ? diveEnd + CONN_SCROLL * vh : diveEnd;

            if (scrollY >= diveStart && scrollY < diveEnd) {
                // Inside this scene's dive
                activeIdx = i;
                sceneProgress = (scrollY - diveStart) / (diveEnd - diveStart);
                break;
            } else if (scrollY >= diveEnd && i < N - 1 && scrollY < connEnd) {
                // Inside connector between i and i+1
                activeIdx = i;
                sceneProgress = 1 + (scrollY - diveEnd) / (connEnd - diveEnd); // 1..2
                break;
            } else if (scrollY >= (i < N - 1 ? connEnd : diveEnd)) {
                activeIdx = i;
                sceneProgress = 2; // past this scene
            }

            accumulated = (i < N - 1) ? connEnd : diveEnd;
        }

        // ---- Update scenes ----
        scenes.forEach((sc, i) => {
            if (i === activeIdx) {
                if (!sc.visible) {
                    sc.el.classList.add('active');
                    sc.visible = true;
                }
                // Camera zoom effect: scale from 1.15 → 1.0 over the dive
                const t = Math.min(sceneProgress, 1);
                const scale = 1.15 - (0.15 * easeOutCubic(t));
                const translateY = -10 + (10 * easeOutCubic(t)); // slight rise
                sc.img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                sc.img.style.filter = `brightness(${0.55 + 0.1 * easeOutCubic(t)}) saturate(1.1)`;
            } else if (i === activeIdx + 1 && sceneProgress > 1) {
                // Incoming scene during crossfade
                if (!sc.visible) {
                    sc.el.classList.add('active');
                    sc.visible = true;
                }
                const crossfadeT = sceneProgress - 1; // 0..1
                sc.el.style.opacity = crossfadeT;
                sc.img.style.transform = `scale(${1.15 - 0.15 * easeOutCubic(crossfadeT)})`;
            } else {
                if (sc.visible) {
                    sc.el.classList.remove('active');
                    sc.el.style.opacity = 0;
                    sc.visible = false;
                }
                sc.img.style.transform = 'scale(1.15)';
            }
        });

        // ---- Update copies (text) ----
        copies.forEach((c, i) => {
            if (i === activeIdx) {
                // Fade in during first 30% of dive, fade out during last 20%
                let opacity = 0;
                if (sceneProgress < 0.3) {
                    opacity = sceneProgress / 0.3;
                } else if (sceneProgress < 0.8) {
                    opacity = 1;
                } else if (sceneProgress <= 1) {
                    opacity = 1 - (sceneProgress - 0.8) / 0.2;
                }
                c.style.opacity = Math.max(0, Math.min(1, opacity));
                c.style.transform = `translate(-50%, calc(-50% + ${20 * (1 - opacity)}px))`;
            } else {
                c.style.opacity = 0;
            }
        });

        // ---- Nav dots ----
        if (SECTIONS._dots) {
            SECTIONS._dots.forEach((d, i) => {
                d.classList.toggle('active', i === activeIdx);
            });
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        document.body.style.height = `${totalHeight}px`;
        onScroll();
    });

    // Initial render
    update();

    // Preload first image
    if (scenes[0]) {
        const preload = new Image();
        preload.src = SECTIONS[0].still;
    }
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
