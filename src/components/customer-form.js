import { loadTemplate } from './template-loader.js';

class CustomerForm extends HTMLElement {
  static get observedAttributes() {
    return ['mode'];
  }

  constructor() {
    super();
    this._mode = 'create';
  }

  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
    this.setAttribute('mode', value);
    this._updateMode();
  }

  async connectedCallback() {
    const tpl = await loadTemplate(
      new URL('../templates/customer-form.html', import.meta.url),
      '#customer-form-template'
    );
    this.appendChild(tpl.cloneNode(true));

    this._fields = this.querySelectorAll('.field');
    this._button = this.querySelector('.submit');

    this._button.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('submit', {
          detail: this.value,
          bubbles: true
        })
      );
    });

    this._updateMode();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'mode') {
      this._mode = newValue;
      this._updateMode();
    }
  }

  _updateMode() {
    if (!this._fields || !this._button) return;

    const readonly = this.mode === 'view';
    this._fields.forEach(f => (f.disabled = readonly));
    this._button.style.display = readonly ? 'none' : 'inline-block';
  }

  get value() {
    return {
      id: this._fields[0].value,
      business_name: this._fields[1].value,
      first_name: this._fields[2].value,
      last_name: this._fields[3].value,
      address1: this._fields[4].value,
      address2: this._fields[5].value,
      city: this._fields[6].value,
      province: this._fields[7].value,
      postal_code: this._fields[8].value,
      country: this._fields[9].value,
      email: this._fields[10].value,
      phone: this._fields[11].value,
      date_created: this._fields[12].value
    };
  }

  set value(data) {
    if (!this._fields) return;
    Object.values(data).forEach((v, i) => {
      if (this._fields[i]) this._fields[i].value = v;
    });
  }
}

customElements.define('customer-form', CustomerForm);
