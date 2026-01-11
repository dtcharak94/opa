import { loadTemplate } from './template-loader.js';

class MenuCard extends HTMLElement {
  async connectedCallback() {
    const tpl = await loadTemplate('/templates/menu-card.html', '#menu-card');
    this.attachShadow({ mode: 'open' }).append(tpl.cloneNode(true));
  }

  set data(item) {
    const r = this.shadowRoot;
    r.querySelector('.name').textContent = item.name;
    r.querySelector('.desc').textContent = item.desc;
    r.querySelector('.price').textContent = item.price.toFixed(2);

    r.querySelector('.add').onclick = () =>
      this.dispatchEvent(new CustomEvent('add', { detail: item, bubbles: true }));
  }
}

customElements.define('menu-card', MenuCard);
