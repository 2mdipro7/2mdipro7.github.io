(function () {
    var doc = document.documentElement;
    doc.classList.add('js');

    // Mobile navigation
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
        });
        links.addEventListener('click', function (e) {
            if (e.target.closest('a') && links.classList.contains('is-open')) {
                toggle.click();
            }
        });
    }

    // Header border once the page scrolls
    var header = document.querySelector('.site-header');
    function onScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal on scroll
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // Highlight the current section in a case study table of contents
    var tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length && 'IntersectionObserver' in window) {
        var byId = {};
        tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
        tocLinks[0].classList.add('is-active');
        var tocIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && byId[entry.target.id]) {
                    tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
                    byId[entry.target.id].classList.add('is-active');
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });
        window.addEventListener('scroll', function () {
            if (window.scrollY < 200) {
                tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
                tocLinks[0].classList.add('is-active');
            }
        }, { passive: true });
        Object.keys(byId).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) tocIo.observe(el);
        });
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll progress bar
    var progress = document.querySelector('.scroll-progress');
    if (progress) {
        var setProgress = function () {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        };
        window.addEventListener('scroll', setProgress, { passive: true });
        window.addEventListener('resize', setProgress);
        setProgress();
    }

    // Highlight the nav link for the section in view
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (navLinks.length && 'IntersectionObserver' in window) {
        var navMap = {};
        navLinks.forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) { a.classList.remove('is-active'); });
                if (navMap[entry.target.id]) navMap[entry.target.id].classList.add('is-active');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section[id]').forEach(function (sec) { spy.observe(sec); });
    }

    // Count numbers up when they come into view
    var counters = document.querySelectorAll('[data-count]');
    function runCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        if (reduceMotion || isNaN(target)) { el.textContent = prefix + target + suffix; return; }
        var start = null, duration = 1100;
        function step(ts) {
            if (!start) start = ts;
            var t = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if (counters.length && 'IntersectionObserver' in window) {
        var countIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCount(entry.target);
                    countIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { countIo.observe(el); });
    }

    // Light up connection tracks node by node
    var tracks = document.querySelectorAll('.track');
    tracks.forEach(function (track) {
        track.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    });
    if (tracks.length && 'IntersectionObserver' in window) {
        var trackIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-lit');
                    trackIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        tracks.forEach(function (t) { trackIo.observe(t); });
    } else {
        tracks.forEach(function (t) { t.classList.add('is-lit'); });
    }

    // "Is this you?" self-assessment
    var fitItems = document.querySelectorAll('.fit-item');
    var fitNum = document.querySelector('.fit-num');
    var fitMsg = document.querySelector('.fit-msg');
    var fitCta = document.querySelector('.fit-cta');
    function updateFit() {
        var n = document.querySelectorAll('.fit-item[aria-pressed="true"]').length;
        if (fitNum) {
            fitNum.textContent = n;
            fitNum.classList.remove('bump');
            void fitNum.offsetWidth;
            fitNum.classList.add('bump');
        }
        if (fitMsg) {
            if (n === 0) fitMsg.textContent = 'Select any that apply to your team.';
            else if (n < 3) fitMsg.textContent = 'Keep going. Most teams I work with recognise three or more.';
            else fitMsg.textContent = 'That’s exactly the kind of problem I solve. Let’s map it together.';
        }
        if (fitCta) fitCta.classList.toggle('is-hot', n >= 3);
    }
    fitItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var on = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', on ? 'false' : 'true');
            updateFit();
        });
    });
})();
