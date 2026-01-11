/* ================== components/category-nav.js ================== */import { loadTemplate } from './template-loader.js';

class CategoryNav extends HTMLElement {
  async connectedCallback() {
    const tpl = await loadTemplate('/templates/category-nav.html', '#category-nav');
    this.attachShadow({ mode: 'open' }).append(tpl.cloneNode(true));
  }
}

customElements.define('category-nav', CategoryNav);
