export default function decorate(block) {
  const hpHero = block.closest('.hero.block');
  if (hpHero) {
    const background = document.createElement('div');
    background.className = 'hero-background';
    [...block.children].forEach((item, i) => {
      const childDiv = item.querySelector('div');
      if (i === 2) {
        item.className = 'hero-foreground';
      } else {
        if (i === 0) {
          item.classList.add('hero-img-desktop');
        } else {
          item.classList.add('hero-img-mobile');
        }
        background.append(item);
      }
      if (childDiv.innerHTML === '') {
        childDiv.parentElement.remove();
      }
    });
    block.append(background);
  }
}
