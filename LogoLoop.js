const escapeHtml = (value = '') => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const LogoLoop = ({ cards = [], ariaLabel = 'Creative focus cards' }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-grid';
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', ariaLabel);

  cards.forEach((card, index) => {
    const item = document.createElement('article');
    item.className = 'magic-bento-card magic-bento-card--border-glow';
    item.innerHTML = `
      <div class="magic-bento-card__header">
        <span class="magic-bento-card__label">${escapeHtml(card.label)}</span>
      </div>
      <div class="magic-bento-card__content">
        <h3 class="magic-bento-card__title">${escapeHtml(card.title)}</h3>
        <p class="magic-bento-card__description">${escapeHtml(card.description)}</p>
      </div>
    `;

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      item.style.setProperty('--glow-x', `${x}px`);
      item.style.setProperty('--glow-y', `${y}px`);
      item.style.setProperty('--glow-intensity', '1');
    });

    item.addEventListener('pointerleave', () => {
      item.style.setProperty('--glow-intensity', '0');
    });

    if (index === 2) item.classList.add('particle-container');
    wrapper.appendChild(item);
  });

  return wrapper;
};

export default LogoLoop;
