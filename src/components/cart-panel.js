import { loadTemplate } from './template-loader.js';

class CartPanel extends HTMLElement {
  async connectedCallback() {
    const tpl = await loadTemplate('/templates/cart-panel.html', '#cart-panel');
    this.attachShadow({ mode: 'open' }).append(tpl.cloneNode(true));
  }
}

customElements.define('cart-panel', CartPanel);
