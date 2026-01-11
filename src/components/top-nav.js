import { loadTemplate } from './template-loader.js';

class TopNav extends HTMLElement {
  async connectedCallback() {
    try {
      const tpl = await loadTemplate(
        new URL('../templates/top-nav.html', import.meta.url),
        '#top-nav-template'
      );
      
      // Get the CONTENT of the template, not the template itself
      const content = tpl.content || tpl;
      this.appendChild(content.cloneNode(true));
      
      if (window.Alpine) {
        window.Alpine.initTree(this);
      }
    } catch (error) {
      console.error('TopNav error:', error);
    }
  }
}
customElements.define('top-nav', TopNav);