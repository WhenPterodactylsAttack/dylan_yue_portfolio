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

	// Close mobile nav when a nav link is clicked
	const navAnchors = Array.from(document.querySelectorAll('.primary-nav a'));
	navAnchors.forEach(a => a.addEventListener('click', (e) => {
		// immediately set active class on click for immediate visual feedback
		navLinks.forEach(l => l.classList.remove('active'));
		a.classList.add('active');
		if (primaryNav && primaryNav.classList.contains('open')) {
			primaryNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
			navToggle.classList.remove('open');
		}
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
});
