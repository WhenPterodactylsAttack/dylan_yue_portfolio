document.addEventListener('DOMContentLoaded', function () {
	// Mobile nav toggle
	const navToggle = document.getElementById('navToggle');
	const primaryNav = document.getElementById('primaryNav');

	if (navToggle && primaryNav) {
		navToggle.addEventListener('click', () => {
			const open = primaryNav.classList.toggle('open');
			navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			// animate hamburger to X
			navToggle.classList.toggle('open', open);
		});
	}

	// Close mobile nav when a nav link is clicked and perform smooth scroll
	const navAnchors = Array.from(document.querySelectorAll('.primary-nav a'));
	const header = document.getElementById('header');
	const headerHeight = header ? header.offsetHeight : 64;

	let observerPaused = false;
	let observerPauseTimer = null;
	const OBSERVER_PAUSE_MS = 700; // milliseconds to ignore observer while smooth-scrolling

	function pauseObserverTemporarily() {
		observerPaused = true;
		if (observerPauseTimer) clearTimeout(observerPauseTimer);
		observerPauseTimer = setTimeout(() => { observerPaused = false; observerPauseTimer = null; }, OBSERVER_PAUSE_MS);
	}

	function scrollToSection(targetEl) {
		if (!targetEl) return;
		// Calculate target top minus header height with a small offset
		const rect = targetEl.getBoundingClientRect();
		const absoluteTop = rect.top + window.pageYOffset;
		const scrollTop = Math.max(absoluteTop - headerHeight - 12, 0);
		// pause observer updates while we initiate smooth scroll
		pauseObserverTemporarily();
		window.scrollTo({ top: scrollTop, behavior: 'smooth' });
	}

    navAnchors.forEach(a => a.addEventListener('click', (e) => {
		e.preventDefault();
		const href = a.getAttribute('href');
		const target = document.querySelector(href);

		// immediately set active class on click for immediate visual feedback
		navLinks.forEach(l => l.classList.remove('active'));
		a.classList.add('active');

		// close mobile nav if open
		if (primaryNav && primaryNav.classList.contains('open')) {
			primaryNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
			navToggle.classList.remove('open');
		}


		// smooth scroll to target accounting for fixed header
		scrollToSection(target);
	}));

	// Close on Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && primaryNav && primaryNav.classList.contains('open')) {
			primaryNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
			navToggle.classList.remove('open');
		}
	});

	// Close mobile nav when resizing to desktop widths
	window.addEventListener('resize', () => {
		if (window.innerWidth > 740 && primaryNav && primaryNav.classList.contains('open')) {
			primaryNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
			navToggle.classList.remove('open');
		}
	});

	// Active link highlighting using IntersectionObserver
	const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
	const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    if (sections.length && navLinks.length) {
		// use a 50% visibility threshold so short sections still register as active
		const obsOpts = { root: null, rootMargin: '0px 0px 0px 0px', threshold: 0.5 };
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (observerPaused) return; // ignore observer updates while paused to avoid stale active state
				const id = entry.target.id;
				const link = document.querySelector(`.primary-nav a[href="#${id}"]`);
				if (entry.isIntersecting) {
					navLinks.forEach(l => l.classList.remove('active'));
					if (link) link.classList.add('active');
				}
			});
		}, obsOpts);

		sections.forEach(section => observer.observe(section));
	}

		// also update on resize (no indicator)
		window.addEventListener('resize', () => {
			// noop: we still keep resize listener for menu collapse
		});


	// Section reveal animations: add .reveal to sections and toggle .visible when in view
	const revealable = Array.from(document.querySelectorAll('section, .content-section, .hero'));

	// initialize reveal class on elements if not present
	revealable.forEach(el => {
		if (!el.classList.contains('reveal')) el.classList.add('reveal');
	});

	// Observe for reveal visibility
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				// if this element has stagger children, apply incremental delays
				if (entry.target.classList.contains('stagger')) {
					const children = Array.from(entry.target.querySelectorAll('[data-reveal]'));
					children.forEach((c, i) => {
						const delay = i * 80; // ms
						c.style.transitionDelay = `${delay}ms`;
					});
					// ensure children get visible class via parent selector
					entry.target.classList.add('visible');
				}
			} else {
				// keep visible once revealed for a consistent experience
				// entry.target.classList.remove('visible');
			}
		});
	}, { threshold: 0.18 });

	revealable.forEach(el => revealObserver.observe(el));

	// Make anchor/keyboard navigation use our header-offset smooth scroll
	// For browsers that support CSS `scroll-behavior`, keep it, but ensure offset for fixed header
	document.addEventListener('click', (e) => {
		const link = e.target.closest && e.target.closest('a[href^="#"]');
		if (!link) return;
		const href = link.getAttribute('href');
		if (!href || href === '#') return;
		const target = document.querySelector(href);
		if (target) {
			e.preventDefault();
			// use same scrollToSection helper defined earlier
			scrollToSection(target);
		}
	});
});
