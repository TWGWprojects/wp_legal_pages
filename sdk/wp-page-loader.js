document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'https://twgwprojects.github.io/wp_legal_pages/api';

  const container = document.getElementById('legal-page');
  if (!container) return;

  const slug = container.dataset.slug;
  if (!slug) return;

  fetch(`${API_BASE}/${slug}.json`)
    .then(res => res.json())
    .then(page => {
      // ✅ Title
      const titleEl = document.getElementById('legal-title');
      if (titleEl) {
        titleEl.textContent = page.title;
      }

      // ✅ Last Updated
      const updatedEl = document.getElementById('legal-last-updated');
      if (updatedEl && page.lastUpdated) {
        updatedEl.textContent = `Last Updated: ${page.lastUpdated}`;
      }

      // ✅ Content
      const contentEl = document.getElementById('legal-content');
      contentEl.innerHTML = '';

      page.content.forEach(block => {
        let el;

        switch (block.type) {
          case 'heading':
            el = document.createElement(`h${block.level || 2}`);
            el.textContent = block.text;
            break;

          case 'paragraph':
            el = document.createElement('p');
            el.innerHTML = block.text; // allows clickable links
            if (block.bold) el.style.fontWeight = 'bold';
            break;

          case 'list':
            el = document.createElement('ul');
            block.items.forEach(item => {
              const li = document.createElement('li');
              li.innerHTML = item;
              el.appendChild(li);
            });
            break;

          case 'table':
            el = document.createElement('div');
            el.textContent = 'Table rendered here';
            break;

          default:
            return;
        }

        contentEl.appendChild(el);
      });
    })
    .catch(err => console.error('Legal page error:', err));
});
