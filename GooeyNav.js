const GooeyNav = ({
  items = [],
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  ariaLabel = 'Primary navigation'
}) => {
  const container = document.createElement('div');
  container.className = 'gooey-nav-container';
  container.setAttribute('role', 'navigation');
  container.setAttribute('aria-label', ariaLabel);

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  const filter = document.createElement('span');
  const text = document.createElement('span');

  filter.className = 'effect filter';
  text.className = 'effect text';

  nav.appendChild(ul);
  container.appendChild(nav);
  container.appendChild(filter);
  container.appendChild(text);

  let activeIndex = initialActiveIndex;

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    const containerRect = container.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };

    Object.assign(filter.style, styles);
    Object.assign(text.style, styles);
    text.innerText = element.innerText;
  };

  const setActiveItem = (index, element) => {
    if (activeIndex === index && element) {
      updateEffectPosition(element);
      return;
    }

    activeIndex = index;
    Array.from(ul.children).forEach((li, liIndex) => {
      li.classList.toggle('active', liIndex === activeIndex);
    });

    if (element) {
      updateEffectPosition(element);
    }

    filter.querySelectorAll('.particle').forEach((particle) => filter.removeChild(particle));
    text.classList.remove('active');
    void text.offsetWidth;
    text.classList.add('active');
    makeParticles(filter);
  };

  const handleClick = (event, index) => {
    const liEl = event.currentTarget.parentElement;
    if (!liEl) return;
    setActiveItem(index, liEl);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const liEl = event.currentTarget.parentElement;
      if (liEl) {
        setActiveItem(index, liEl);
      }
    }
  };

  items.forEach((item, index) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href || '#';
    link.textContent = item.label;
    link.addEventListener('click', (event) => handleClick(event, index));
    link.addEventListener('keydown', (event) => handleKeyDown(event, index));
    li.appendChild(link);
    ul.appendChild(li);
  });

  const renderActiveState = () => {
    Array.from(ul.children).forEach((li, index) => {
      li.classList.toggle('active', index === activeIndex);
    });
    const currentItem = ul.children[activeIndex];
    if (currentItem) {
      updateEffectPosition(currentItem);
      text.classList.add('active');
    }
  };

  requestAnimationFrame(() => {
    renderActiveState();
  });

  const resizeObserver = new ResizeObserver(() => {
    const currentItem = ul.children[activeIndex];
    if (currentItem) {
      updateEffectPosition(currentItem);
    }
  });
  resizeObserver.observe(container);

  return container;
};

export default GooeyNav;
