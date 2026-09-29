function initPaTurCase() {
  document.querySelectorAll('.patur-case').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const dialog = root.querySelector('.pt-lightbox');
    const largeImage = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    let sourceLink;
    if (typeof dialog.showModal === 'function') {
      root.querySelectorAll('[data-zoom]').forEach((link) => {
        link.addEventListener('click', (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          sourceLink = link;
          largeImage.src = link.href;
          largeImage.alt = link.querySelector('img').alt;
          caption.textContent = largeImage.alt;
          dialog.showModal();
        });
      });
      dialog.querySelector('.pt-close').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (event) => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
      });
      dialog.addEventListener('close', () => sourceLink?.focus({ preventScroll: true }));
    }
    const mapLink = root.querySelector('.pt-map-shot');
    const mapImage = mapLink.querySelector('img');
    const imageBase = mapLink.getAttribute('href').replace(/[^/]+$/, '');
    const mapDescriptions = {
      utforskning: 'Utforskningskart med alle turer tegnet i ulike farger rundt Langhus.',
      hverdager: 'Utforskningskart filtrert til hverdagsturer.',
      mandag: 'Utforskningskart filtrert til mandagsturer.'
    };
    root.querySelector('.pt-map-controls').hidden = false;
    root.querySelectorAll('[data-map]').forEach((button) => {
      button.addEventListener('click', () => {
        mapLink.href = imageBase + button.dataset.map + '.webp';
        mapImage.src = mapLink.href;
        mapImage.alt = mapDescriptions[button.dataset.map];
        root.querySelectorAll('[data-map]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        root.querySelector('.pt-map-status').textContent = 'Viser: ' + button.dataset.label;
      });
    });
    if ('IntersectionObserver' in window) {
      const links = [...root.querySelectorAll('.pt-toc a')];
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        links.forEach((link) => {
          if (link.hash === '#' + visible[0].target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-5% 0px -65% 0px', threshold: 0 });
      links.forEach((link) => { const section = root.querySelector(link.hash); if (section) observer.observe(section); });
      document.addEventListener('astro:before-swap', () => observer.disconnect(), { once: true });
    }
  });
}
initPaTurCase();
document.addEventListener('astro:page-load', initPaTurCase);
