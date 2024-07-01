import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1140px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.forEach((section) => {
    section.querySelectorAll('.default-content-wrapper > ul > li')
      .forEach((item) => item.setAttribute('aria-expanded', expanded));
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'false');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  navSections.forEach((section) => {
    const navDrops = section.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('role', 'button');
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('role');
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  });
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Toggles the search bar via the close button
 * @param {Event} e The event passed in via click handler
 */
function handleSearchClose(e) {
  const wrapper = e.target.closest('.search-wrapper');
  if (!wrapper?.classList.contains('hidden')) {
    wrapper.classList.add('hidden');
  }
  const searchIcon = e.target.closest('li')?.querySelector('.icon-search.hidden');
  searchIcon?.classList.remove('hidden');
}

/**
 * Toggles the search bar
 * @param {Element} parent The list container element
 */
function setupSearchClickHandler(block) {
  const search = block.querySelector('.icon-search');
  search?.closest('li').classList.add('search-toggle');
  search.addEventListener('click', (e) => {
    e.target.closest('.icon-search')?.classList.add('hidden');
    const parent = e.target.closest('li')?.querySelector('.search-wrapper');
    if (parent?.classList.contains('hidden')) {
      parent.classList.remove('hidden');
    }
  });
}

function appendSearchWrapper(block) {
  const liSearchParent = block.querySelector('.nav-sections > div > ul > li:last-child');

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('search-wrapper', 'hidden');
  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.classList.add('search-input-wrapper');
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('name', 'q');
  searchInput.classList.add('search-input');
  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.classList.add('button', 'primary');
  const submitBtnText = document.createTextNode('Search');
  submitBtn.append(submitBtnText);

  const searchIconWrapper = document.createElement('div');
  searchIconWrapper.classList.add('search-icon');
  const searchIconSpan = document.createElement('span');
  searchIconSpan.classList.add('icon', 'icon-search');
  const searchIconImg = document.createElement('img');
  searchIconImg.setAttribute('data-icon-name', 'search');
  searchIconImg.setAttribute('src', '/icons/search.svg');
  searchIconImg.setAttribute('alt', 'search icon');
  searchIconImg.setAttribute('loading', 'lazy');
  searchIconSpan.append(searchIconImg);
  searchIconWrapper.append(searchIconSpan);

  const closeIconWrapper = document.createElement('button');
  closeIconWrapper.setAttribute('type', 'button');
  closeIconWrapper.classList.add('close-icon');
  closeIconWrapper.addEventListener('click', handleSearchClose);
  const closeIconSpan = document.createElement('span');
  closeIconSpan.classList.add('icon', 'icon-close');
  const closeIconImg = document.createElement('img');
  closeIconImg.setAttribute('data-icon-name', 'search');
  closeIconImg.setAttribute('src', '/icons/close.svg');
  closeIconImg.setAttribute('alt', 'close icon');
  closeIconImg.setAttribute('loading', 'lazy');
  closeIconSpan.append(closeIconImg);
  closeIconWrapper.append(closeIconSpan);

  searchInputWrapper.append(searchIconWrapper);
  searchInputWrapper.append(searchInput);
  searchInputWrapper.append(closeIconWrapper);
  searchWrapper.append(searchInputWrapper);
  searchWrapper.append(submitBtn);

  liSearchParent.append(searchWrapper);
  setupSearchClickHandler(block);
}

function addClassesToNavDropdowns(block) {
  const navDrops = block.querySelectorAll('.nav-drop');
  navDrops.forEach((dropdown, index) => {
    const backBtn = document.createElement('button');
    const backBtnText = document.createTextNode('back');
    backBtn.setAttribute('type', 'button');
    backBtn.classList.add('button', 'back-btn');
    backBtn.append(backBtnText);
    const wrapper = document.createElement('div');
    wrapper.classList.add('nav-drop-container');
    const data = dropdown.querySelector('ul');
    wrapper.append(backBtn);
    wrapper.append(data);

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.classList.add('close-menu');
    closeBtn.innerHTML = `
      <span class="icon icon-close">
        <img data-icon-name="close" src="/icons/close.svg" alt="Close menu" loading="lazy" />
      </span>
      <span class="close-text">Close</span>
    `;

    if (index === 0) {
      dropdown.classList.add('products');
      wrapper.prepend(closeBtn);
    } else if (index === 1) {
      dropdown.classList.add('about-us');
      wrapper.prepend(closeBtn);
    } else if (index === 2) {
      dropdown.classList.add('login');
    } else if (index === 3) {
      dropdown.classList.add('menu');
      wrapper.prepend(closeBtn);
    }
    dropdown.appendChild(wrapper);
  });
}

function setupMobileStructure(block) {
  const navTools = block.querySelector('.nav-tools')?.cloneNode(true);
  navTools.classList.remove('nav-tools');
  navTools.classList.add('nav-tools-mobile');
  const navSections = block.querySelector('.nav-sections');
  navSections?.before(navTools);

  navTools.querySelector('.nav-drop.login')?.addEventListener('click', (e) => {
    const target = e.target.closest('.nav-drop.login');
    const expanded = target?.getAttribute('aria-expanded') === 'true';
    const allSections = block.querySelectorAll('.nav-sections, .nav-tools');
    toggleAllNavSections(allSections);
    target?.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelectorAll('.nav-sections, .nav-tools');
  navSections?.forEach((navSection) => {
    const items = navSection.querySelectorAll(':scope .default-content-wrapper > ul > li');
    items?.forEach((item) => {
      if (item.querySelector('ul')) item.classList.add('nav-drop');
      item.addEventListener('click', () => {
        // if (isDesktop.matches) {
        //   const expanded = item.getAttribute('aria-expanded') === 'true';
        //   toggleAllNavSections(navSections);
        //   item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        // }
        const expanded = item.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    });
  });

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  appendSearchWrapper(block);
  addClassesToNavDropdowns(block);
  setupMobileStructure(block);
}
