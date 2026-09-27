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
})();
