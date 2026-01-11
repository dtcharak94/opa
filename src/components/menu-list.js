import { loadTemplate } from './template-loader.js';

class MenuList extends HTMLElement {
  async connectedCallback() {
    const tpl = await loadTemplate('/templates/menu-list.html', '#menu-list');
    this.attachShadow({ mode: 'open' }).append(tpl.cloneNode(true));
  }
}

customElements.define('menu-list', MenuList);
