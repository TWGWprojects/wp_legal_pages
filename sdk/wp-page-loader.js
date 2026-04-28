document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'https://twgwprojects.github.io/wp_legal_pages/api';

  const container = document.getElementById('legal-page');
  if (!container) return;

  const slug = container.dataset.slug;
  if (!slug) return;
  
  
  const site = document.body.dataset.legalSite || 'example';
  const email = document.body.dataset.legalEmaildomain || 'example.com';


  fetch(`${API_BASE}/${slug}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load legal JSON: ${res.status}`);
      return res.json();
    })
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

      const contentEl = document.getElementById('legal-content');
      if (!contentEl) return;
      contentEl.innerHTML = '';

      (page.content || []).forEach(block => {
        let el;

        switch (block.type) {
          case 'heading': {
            el = document.createElement(`h${block.level || 2}`);
            el.textContent = block.text || '';
            break;
          }

          case 'paragraph': {
            el = document.createElement('p');
            // clickable links in paragraph text
			  const txt = (block.text || '')
			    .replaceAll('{SITE}', site)
			    .replaceAll('{EMAIL}', email);

            if (block.bold) el.style.fontWeight = 'bold';
            break;
          }

          case 'list': {
            el = document.createElement('ul');
            (block.items || []).forEach(item => {
              const li = document.createElement('li');
              // clickable links in list items too
              li.innerHTML = item || '';
              el.appendChild(li);
            });
            break;
          }

          case 'table': {
            el = renderLegalTable(block);
            break;
          }

          default:
            // Unknown block types are ignored
            return;
        }

        contentEl.appendChild(el);
      });
    })
    .catch(err => console.error('Legal page error:', err));

  // --- Helpers ---

  function renderLegalTable(block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'legal-table-wrapper';

    // Optional table title
    if (block.title) {
      const h = document.createElement('h3');
      h.textContent = block.title;
      wrapper.appendChild(h);
    }

    const table = document.createElement('table');
    table.className = 'legal-table';

    const columns = Array.isArray(block.columns) ? block.columns : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];

    // THEAD
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // TBODY
    const tbody = document.createElement('tbody');

    rows.forEach(row => {
      const tr = document.createElement('tr');

      columns.forEach(col => {
        const td = document.createElement('td');
        const value = row ? row[col] : '';

        // Category can be object {text, examples[]}
        if (col === 'Category' && value && typeof value === 'object' && !Array.isArray(value)) {
          const strong = document.createElement('strong');
          strong.textContent = value.text || '';
          td.appendChild(strong);

          if (Array.isArray(value.examples) && value.examples.length) {
            const ex = document.createElement('div');
            ex.className = 'legal-table-examples';
            ex.innerHTML = `<em>Examples:</em> ${escapeHtml(value.examples.join(', '))}`;
            td.appendChild(ex);
          }
        }
        // Arrays -> bullet list within cell
        else if (Array.isArray(value)) {
          const ul = document.createElement('ul');
          value.forEach(item => {
            const li = document.createElement('li');
            // allow clickable links if item contains <a ...>
            li.innerHTML = item || '';
            ul.appendChild(li);
          });
          td.appendChild(ul);
        }
        // Simple string -> allow clickable links too
        else {
          td.innerHTML = value || '';
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
