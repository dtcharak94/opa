async function loadTemplate(id) {
  // Load template HTML if not already in DOM
  if (!document.getElementById('review-manager-templates')) {
    const res = await fetch('/src/templates/review-manager.html');
    const html = await res.text();
    document.body.insertAdjacentHTML('beforeend', html);
  }
  const tpl = document.getElementById(id);
  if (!tpl) throw new Error(`Template ${id} not found`);
  return tpl.content.cloneNode(true);
}

class ReviewManager extends HTMLElement {
  constructor() {
    super();
    this.reviews = [];
    this.currentPage = 1;
    this.pageSize = 5;
  }

  async connectedCallback() {
    // Load templates
    const template = await loadTemplate('reviewManagerTemplate');
    this.appendChild(template);

    this.reviewCardTemplate = await loadTemplate('reviewCardTemplate');

    // Cache elements
    this.reviewsEl = this.querySelector('[data-reviews]');
    this.paginationEl = this.querySelector('[data-pagination]');
    this.submitBtn = this.querySelector('[data-action="submit"]');

    this.fields = {};
    this.querySelectorAll('[data-field]').forEach(el => {
      this.fields[el.dataset.field] = el;
    });

    this.submitBtn.addEventListener('click', () => this.addReview());

    this.renderReviews();
  }

  addReview() {
    const menu = this.fields.menu.value.trim();
    const description = this.fields.description.value.trim();
    const rating = parseInt(this.fields.rating.value, 10);

    if (!menu || !description) return;

    this.reviews.unshift({
      menu,
      description,
      rating,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset form
    this.fields.menu.value = '';
    this.fields.description.value = '';
    this.fields.rating.value = '3';

    this.currentPage = 1;
    this.renderReviews();
  }

  renderReviews() {
    this.reviewsEl.innerHTML = '';

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageItems = this.reviews.slice(start, end);

    pageItems.forEach(review => {
      const clone = document.importNode(this.reviewCardTemplate, true);
      clone.querySelector('[data-menu]').textContent = review.menu;
      clone.querySelector('[data-description]').textContent = review.description;
      clone.querySelector('[data-date]').textContent = review.date;

      const starsContainer = clone.querySelector('[data-stars]');
      starsContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.textContent = i < review.rating ? '⭐' : '☆';
        starsContainer.appendChild(star);
      }

      this.reviewsEl.appendChild(clone);
    });

    this.renderPagination();
  }

  renderPagination() {
    this.paginationEl.innerHTML = '';
    const totalPages = Math.ceil(this.reviews.length / this.pageSize);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded ${
        i === this.currentPage ? 'bg-emerald-500 text-white' : 'bg-gray-200'
      }`;
      btn.addEventListener('click', () => {
        this.currentPage = i;
        this.renderReviews();
      });
      this.paginationEl.appendChild(btn);
    }
  }
}

customElements.define('review-manager', ReviewManager);
