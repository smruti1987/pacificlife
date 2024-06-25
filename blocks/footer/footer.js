import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function removeButtonClass() {
  const footer = document.querySelector('.footer');
  if (footer) {
    const links = footer.querySelectorAll('.button');
    if (links) {
      links.forEach((link) => {
        link.removeAttribute('class');
      });
    }
  }
}

function socialMediaFooterClass() {
  const footerEl = document.querySelector('.footer.block');
  if (footerEl) {
    const column = footerEl.querySelector('.columns-container:not(.footer-nav)');
    column.classList.add('social-media');
    const lastColumn = column?.querySelector('.columns.block > div > div:last-child');
    lastColumn.classList.add('social-media-icons');
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
  removeButtonClass();
  socialMediaFooterClass();
}
