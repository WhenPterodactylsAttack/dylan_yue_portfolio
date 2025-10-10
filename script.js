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

	// Active link highlighting using IntersectionObserver
	const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
	const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

	if (sections.length && navLinks.length) {
		const obsOpts = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 };
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
});
