export default function decorate(block) {
  const hpHero = block.closest('.hero.block');
  if (hpHero) {
    const foreground = document.createElement('div');
    foreground.className = 'hero-foreground';
    [...block.children].forEach((item, i) => {
      const childDiv = item.querySelector('div');
      if (i !== 1) {
        item.classList.add(`hero-foreground-item-${i}`);
        foreground.append(item);
      } else {
        item.className = 'hero-background';
      }
      if (childDiv.innerHTML === '') {
        childDiv.parentElement.remove();
      }
    });
    block.append(foreground);
  }
}
