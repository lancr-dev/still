'use strict';

const themeButtons = [...document.querySelectorAll('.theme-toggle')];
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  const darkMode = theme === 'dark';
  document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  themeColor.setAttribute('content', darkMode ? '#141f1a' : '#f3f6f2');
  themeButtons.forEach((button) => {
    button.hidden = false;
    button.setAttribute('aria-pressed', String(darkMode));
    button.title = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    const state = button.querySelector('.theme-state');
    if (state) state.textContent = darkMode ? 'On' : 'Off';
  });
}

try {
  applyTheme(localStorage.getItem('still-theme'));
} catch {
  applyTheme('light');
}

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      localStorage.setItem('still-theme', theme);
    } catch {
      themeButtons.forEach((toggle) => {
        toggle.title += ' (preference cannot be saved in this browser)';
      });
    }
  });
});

window.addEventListener('storage', (event) => {
  if (event.key === 'still-theme' || event.key === null) {
    applyTheme(event.newValue);
  }
});

const menu = document.querySelector('.mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const desktopWidth = window.matchMedia('(min-width: 1100px)');

if (typeof menu.showModal === 'function') {
  document.documentElement.classList.add('has-menu');
  menuToggle.hidden = false;

  menuToggle.addEventListener('click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  });

  const closeMenu = () => menu.close();
  menuClose.addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });

  menu.addEventListener('click', (event) => {
    if (event.target !== menu) return;
    const bounds = menu.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      closeMenu();
  });

  menu.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      const target = document.querySelector(link.hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener(
        'blur',
        () => target.removeAttribute('tabindex'),
        { once: true },
      );
    });
  });

  desktopWidth.addEventListener('change', (event) => {
    if (event.matches && menu.open) closeMenu();
  });
}

const studies = {
  spaces: {
    brand: 'forma.',
    navigation: 'Spaces / Philosophy / Studio',
    overline: 'ARCHITECTURE, WITH FEELING',
    headline: ['Spaces for', 'slower living.'],
    description:
      'Considered spaces. Natural materials. A little closer to what matters.',
    link: 'Discover our spaces',
    footer: 'A CONSIDERED APPROACH TO SPACE',
    image: 'assets/svg/architecture.svg',
    alt: 'Architectural illustration of a green archway and steps',
    category: '01 / Architecture & interiors',
    title: ['Let your work', 'do the talking.'],
    detail:
      'Generous imagery. An editorial rhythm. A calm canvas that puts your spaces, projects, or creative work in the foreground.',
    feeling: 'Grounded, open, considered',
    audience: 'Architects, designers & creative studios',
    direction: 'The spatial studio',
  },
  objects: {
    brand: 'MORROW',
    navigation: 'Objects / Our approach / Journal',
    overline: 'FEWER THINGS. BETTER THINGS.',
    headline: ['Everyday,', 'well made.'],
    description:
      'Useful objects with a quiet presence. Made to become part of your day.',
    link: 'Meet the collection',
    footer: 'OBJECTS TO LIVE WITH, AND KEEP',
    image: 'assets/svg/objects.svg',
    alt: 'Illustration of two green ceramic vessels resting on a sunlit pedestal',
    category: '02 / Independent retail',
    title: ['Good things.', 'Room to shine.'],
    detail:
      'Let the material, shape, and story take the lead. A thoughtful shop gives each product its own moment, with a clear path from discovery to purchase.',
    feeling: 'Tactile, honest, warm',
    audience: 'Makers, independent shops & product brands',
    direction: 'The thoughtful shop',
  },
  botanical: {
    brand: 'root & rest',
    navigation: 'Approach / Sessions / About',
    overline: 'COME BACK TO YOURSELF',
    headline: ['A little space', 'to grow.'],
    description:
      'Thoughtful guidance. Time to listen. A practice that meets you where you are.',
    link: 'Find your starting point',
    footer: 'ROOTED IN CARE. OPEN TO POSSIBILITY.',
    image: 'assets/svg/botanical.svg',
    alt: 'Botanical illustration of a branching green plant inside a pale arch',
    category: '03 / Personal brands & practices',
    title: ['A welcome that', 'feels like you.'],
    detail:
      'Personal words, natural forms, and an unhurried pace. Help visitors understand your approach and feel comfortable taking the first step.',
    feeling: 'Personal, reassuring, natural',
    audience: 'Coaches, wellness practices & independent professionals',
    direction: 'The personal practice',
  },
};

const selector = document.querySelector('.study-selector');
const studyButtons = [...selector.querySelectorAll('button')];
const preview = document.querySelector('.website-preview');
const direction = document.querySelector('#design-direction');
let selectedStudy = 'spaces';

function setLines(element, lines) {
  element.replaceChildren(
    document.createTextNode(lines[0]),
    document.createElement('br'),
    document.createTextNode(lines[1]),
  );
}

function selectStudy(key) {
  const study = studies[key];
  if (!study) return;
  selectedStudy = key;
  studyButtons.forEach((button) =>
    button.setAttribute('aria-pressed', String(button.dataset.study === key)),
  );
  preview.dataset.preview = key;
  const textFields = {
    'preview-brand': study.brand,
    'preview-navigation': study.navigation,
    'preview-overline': study.overline,
    'preview-description': study.description,
    'preview-footer': study.footer,
    'study-category': study.category,
    'study-description': study.detail,
    'study-feeling': study.feeling,
    'study-audience': study.audience,
  };
  Object.entries(textFields).forEach(([id, text]) => {
    document.getElementById(id).textContent = text;
  });
  setLines(document.querySelector('#preview-title'), study.headline);
  setLines(document.querySelector('#study-title'), study.title);
  document.querySelector('#preview-link').firstChild.textContent =
    `${study.link} `;
  const illustration = document.querySelector('#preview-image');
  illustration.src = study.image;
  illustration.alt = study.alt;
  document.querySelector('#study-announcement').textContent =
    `${study.direction} selected. ${study.feeling}. Made for ${study.audience.toLowerCase()}.`;
}

selector.hidden = false;
studyButtons.forEach((button) =>
  button.addEventListener('click', () => selectStudy(button.dataset.study)),
);
document.querySelector('#choose-study').addEventListener('click', () => {
  direction.value = studies[selectedStudy].direction;
});

const navLinks = [
  ...document.querySelectorAll('.desktop-nav a, .mobile-menu nav a'),
];
const sections = [...document.querySelectorAll('main > section[id]')];
let scrollUpdatePending = false;

function updateCurrentSection() {
  const threshold =
    document.querySelector('.site-header').getBoundingClientRect().height + 100;
  let currentId = sections[0].id;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= threshold)
      currentId = section.id;
  });
  navLinks.forEach((link) => {
    if (link.hash === `#${currentId}`)
      link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollUpdatePending = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(updateCurrentSection);
  },
  { passive: true },
);
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();

const briefForm = document.querySelector('.brief-form');
const brandName = document.querySelector('#brand-name');
const brandStory = document.querySelector('#brand-story');
const briefResult = document.querySelector('.brief-result');
const briefOutput = document.querySelector('#generated-brief');
const formStatus = document.querySelector('.form-status');
const copyButton = document.querySelector('.copy-brief');
briefForm.querySelector('[type="submit"]').disabled = false;

[brandName, brandStory].forEach((field) => {
  field.addEventListener('input', () => field.setCustomValidity(''));
});

briefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  [brandName, brandStory].forEach((field) => {
    field.setCustomValidity(
      field.value.trim() ? '' : 'Please add a few words here.',
    );
  });
  if (!briefForm.reportValidity()) return;

  briefOutput.value = [
    'MY MINIMALIST WEBSITE BRIEF',
    '',
    `Name / brand: ${brandName.value.trim()}`,
    `Design direction: ${direction.value}`,
    '',
    'About my idea:',
    brandStory.value.trim(),
    '',
    'Design notes: A minimalist website with thoughtful typography, clear navigation, generous space, and a responsive layout.',
    'Palette: #f3f6f2, #d6e2d8, #a3c0b0, #4c6b5e, #1b2a24.',
    '',
    'Inspired by still. — A study in less.',
  ].join('\n');
  briefResult.hidden = false;
  formStatus.textContent =
    'Your brief is ready. Copy it and share it with your developer. Nothing has been sent.';
  briefOutput.focus({ preventScroll: true });
  briefOutput.scrollIntoView({ block: 'nearest', behavior: 'auto' });
});

copyButton.addEventListener('click', async () => {
  copyButton.disabled = true;
  try {
    if (!navigator.clipboard || !window.isSecureContext)
      throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(briefOutput.value);
    formStatus.textContent =
      'Copied. Your project brief is ready to paste into a message.';
  } catch {
    briefOutput.focus();
    briefOutput.select();
    formStatus.textContent =
      'Automatic copying isn’t available here. Your brief is selected—use your device’s Copy command, or press Ctrl+C / Command+C.';
  } finally {
    copyButton.disabled = false;
  }
});

document.querySelector('#year').textContent = String(new Date().getFullYear());
