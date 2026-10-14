/* =====================================================
   BAUCAN PORTFOLIO — interactions
   1. Mobile navigation toggle
   2. Scroll-spy (active nav link)
   3. Project shelf filter
   4. Copy email to clipboard
   5. Contact form (validates, then opens the mail client)
   ===================================================== */

(function () {
    'use strict';

    /* ---------- 1. Mobile navigation toggle ---------- */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- 2. Scroll-spy: highlight the section in view ---------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));

    function setActive(id) {
        links.forEach(function (link) {
            var isMatch = link.getAttribute('href') === '#' + id;
            link.classList.toggle('active', isMatch);
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    /* ---------- 3. Project shelf filter ---------- */
    var filterBar = document.getElementById('filterBar');
    var shelfCabinet = document.getElementById('shelfCabinet');
    var shelfEmpty = document.getElementById('shelfEmpty');

    if (filterBar && shelfCabinet) {
        var shelfItems = Array.prototype.slice.call(shelfCabinet.querySelectorAll('.shelf-item'));

        filterBar.addEventListener('click', function (event) {
            var button = event.target.closest('.filter-btn');
            if (!button) return;

            filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            var filter = button.getAttribute('data-filter');
            var visible = 0;

            shelfItems.forEach(function (item) {
                var show = filter === 'all' || item.getAttribute('data-tag') === filter;
                item.hidden = !show;
                if (show) visible++;
            });

            if (shelfEmpty) {
                shelfEmpty.hidden = visible !== 0;
            }
        });
    }

    /* ---------- 4. Copy email to clipboard ---------- */
    var copyBtn = document.getElementById('copyEmail');

    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var email = copyBtn.getAttribute('data-email');
            var original = copyBtn.textContent;

            var done = function () {
                copyBtn.textContent = 'Copied ✓';
                setTimeout(function () {
                    copyBtn.textContent = original;
                }, 1800);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done).catch(function () {
                    copyBtn.textContent = email;
                });
            } else {
                copyBtn.textContent = email;
            }
        });
    }

    /* ---------- 5. Contact form ---------- */
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');

    if (form && note) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // NB: form.name would read the <form>'s own name attribute,
            // so the fields are looked up explicitly by id instead.
            var name = document.getElementById('cfName').value.trim();
            var email = document.getElementById('cfEmail').value.trim();
            var message = document.getElementById('cfMessage').value.trim();
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                note.classList.add('error');
                note.textContent = 'Please fill in every field.';
                return;
            }

            if (!emailPattern.test(email)) {
                note.classList.add('error');
                note.textContent = 'That email address does not look right.';
                return;
            }

            note.classList.remove('error');

            var subject = encodeURIComponent('Portfolio message from ' + name);
            var body = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
            window.location.href = 'mailto:Bjaybaucan14@gmail.com?subject=' + subject + '&body=' + body;

            note.textContent = 'Thanks, ' + name + '! Your mail app should open now.';
            form.reset();
        });
    }
})();
