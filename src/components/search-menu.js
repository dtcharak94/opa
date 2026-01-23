import { loadTemplate } from '../utils/template-loader.js';

class SearchMenu extends HTMLElement {
  async connectedCallback() {
    // Load templates once
    this.menuTemplate = await loadTemplate('search-menu-template');
    this.resultTemplate = await loadTemplate('menu-result-template');

    // Render UI
    this.appendChild(this.menuTemplate.content.cloneNode(true));

    // Cache elements
    this.resultsSection = this.querySelector('[data-results-section]');
    this.resultsEl = this.querySelector('[data-results]');
    this.countEl = this.querySelector('[data-results-count]');
    this.paginationEl = this.querySelector('[data-pagination]');

    // Pagination state
    this.state = {
      results: [],
      page: 1,
      pageSize: 5,
      totalPages: 1
    };

    this.bindEvents();
  }

  bindEvents() {
    this.querySelector('[data-action="search"]')
      .addEventListener('click', () => {
        this.state.page = 1;
        this.search();
      });

    this.querySelector('[data-action="clear"]')
      .addEventListener('click', () => this.clear());

    this.querySelector('[data-action="back-to-top"]')
      .addEventListener('click', () =>
        this.scrollIntoView({ behavior: 'smooth' })
      );
  }

  get formData() {
    const data = {};
    this.querySelectorAll('[data-field]').forEach(el => {
      data[el.dataset.field] = el.value.trim();
    });
    return data;
  }

  async search() {
    console.log('Search params:', this.formData);

    // 🔁 Replace with real API call
    this.state.results = [
      { id: 1, restaurant: 'Opa Taverna', location: 'Athens', date: '2025-01-10', appetizer: 'Bruschetta', soup: 'Tomato', mainDish: 'Grilled Fish', dessert: 'Baklava' },
      { id: 2, restaurant: 'Sunset Grill', location: 'Los Angeles', date: '2025-01-12', appetizer: 'Spring Rolls', soup: 'Minestrone', mainDish: 'Steak', dessert: 'Tiramisu' },
      { id: 3, restaurant: 'Pizza Palace', location: 'New York', date: '2025-01-15', appetizer: 'Garlic Bread', soup: 'Tomato Soup', mainDish: 'Pizza Margherita', dessert: 'Panna Cotta' },
      { id: 4, restaurant: 'Seafood Delight', location: 'San Francisco', date: '2025-01-16', appetizer: 'Calamari', soup: 'Clam Chowder', mainDish: 'Grilled Salmon', dessert: 'Cheesecake' },
      { id: 5, restaurant: 'Downtown Pasta', location: 'Chicago', date: '2025-01-17', appetizer: 'Bruschetta', soup: 'Minestrone', mainDish: 'Pasta Carbonara', dessert: 'Gelato' },
      { id: 6, restaurant: 'Steak House', location: 'Miami', date: '2025-01-18', appetizer: 'Caesar Salad', soup: 'French Onion', mainDish: 'Ribeye Steak', dessert: 'Chocolate Cake' }
    ];

    // Compute total pages
    this.state.totalPages = Math.ceil(this.state.results.length / this.state.pageSize);

    this.renderResults();
    this.renderPagination();
  }

  clear() {
    this.querySelectorAll('[data-field]').forEach(el => (el.value = ''));
    this.resultsEl.innerHTML = '';
    this.countEl.textContent = '';
    this.resultsSection.classList.add('hidden');
    if (this.paginationEl) this.paginationEl.innerHTML = '';
  }

  renderResults() {
    const start = (this.state.page - 1) * this.state.pageSize;
    const end = start + this.state.pageSize;
    const pageItems = this.state.results.slice(start, end);

    this.resultsEl.innerHTML = '';
    this.countEl.textContent = `${this.state.results.length} result(s) found`;

    this.resultsSection.classList.toggle('hidden', pageItems.length === 0);

    if (pageItems.length === 0) {
      this.resultsEl.innerHTML = `
        <div class="text-center text-slate-500 py-8">
          No results found
        </div>
      `;
      return;
    }

    pageItems.forEach(item => {
      const card = this.resultTemplate.content.cloneNode(true);

      card.querySelector('[data-restaurant]').textContent = item.restaurant;
      card.querySelector('[data-location]').textContent = item.location;
      card.querySelector('[data-date]').textContent = item.date;
      card.querySelector('[data-appetizer]').textContent = item.appetizer;
      card.querySelector('[data-soup]').textContent = item.soup;
      card.querySelector('[data-main]').textContent = item.mainDish;
      card.querySelector('[data-dessert]').textContent = item.dessert;

      card.querySelector('[data-link]').href =
        `/pages/menu.html?id=${item.id}`;

      this.resultsEl.appendChild(card);
    });

    this.resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  renderPagination() {
    if (!this.paginationEl) return;

    this.paginationEl.innerHTML = '';

    // Previous button
    const prev = document.createElement('button');
    prev.textContent = 'Previous';
    prev.disabled = this.state.page === 1;
    prev.className = 'px-3 py-1 rounded bg-slate-700 text-white mr-2';
    prev.addEventListener('click', () => {
      this.state.page--;
      this.renderResults();
      this.renderPagination();
    });
    this.paginationEl.appendChild(prev);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${this.state.page} of ${this.state.totalPages}`;
    pageInfo.className = 'text-sm text-slate-200';
    this.paginationEl.appendChild(pageInfo);

    // Next button
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.disabled = this.state.page >= this.state.totalPages;
    next.className = 'px-3 py-1 rounded bg-slate-700 text-white ml-2';
    next.addEventListener('click', () => {
      this.state.page++;
      this.renderResults();
      this.renderPagination();
    });
    this.paginationEl.appendChild(next);
  }
}

customElements.define('search-menu', SearchMenu);
