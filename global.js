console.log('IT’S ALIVE!');

// Helper function
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Pages list
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/Bobz18', title: 'GitHub' }
];

// Create nav element
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);
let nav = document.createElement('nav');
document.body.prepend(nav);

// Detect base path
const BASE_PATH =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? '/'
    : '/portfolio/';

// Create links
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Fix relative URLs
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // Highlight current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    // Open external links in a new tab
    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
}

let select = document.querySelector('.color-scheme select');

select.addEventListener('input', function (event) {
  let value = event.target.value;

  document.documentElement.style.setProperty('color-scheme', value);

  // save preference
  localStorage.colorScheme = value;
});
if ('colorScheme' in localStorage) {
  let saved = localStorage.colorScheme;

  document.documentElement.style.setProperty('color-scheme', saved);

  select.value = saved;
}