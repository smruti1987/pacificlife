import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createAnchorEl() {
  const cardsContainer = document.querySelector('.hero-cards');
  if (cardsContainer) {
    const cards = cardsContainer.querySelectorAll('li');
    for (let i = 0; i < cards.length; i += 1) {
      if (!cards[i].querySelector('.has-link')) {
        const link = cards[i].querySelector('a');
        const wrapper = document.createElement('a');
        wrapper.setAttribute('href', link.href);
        wrapper.classList.add('has-link');
        wrapper.append(...cards[i].children);
        cards[i].appendChild(wrapper);
        link.parentElement.removeAttribute('class');
        link.parentElement.innerHTML = link.title;
        link.remove();
      }
    }
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
  createAnchorEl();
}
