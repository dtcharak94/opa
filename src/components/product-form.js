import { loadTemplate } from "./template-loader.js";

class ProductForm extends HTMLElement {
  static get observedAttributes() {
    return ["mode"];
  }

  constructor() {
    super();
    this._mode = "create"; // default
  }

  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
    this.setAttribute("mode", value);
    this._updateMode();
  }

  async connectedCallback() {
    const tpl = await loadTemplate(
      new URL("../templates/product-form.html", import.meta.url),
      "#product-form-template"
    );
    this.appendChild(tpl.cloneNode(true));

    this._fields = this.querySelectorAll(".field");
    this._button = this.querySelector(".submit");

    this._button.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("submit", {
          detail: this.value,
          bubbles: true,
        })
      );
    });

    this._updateMode();
  }

  attributeChangedCallback(name) {
    if (name === "mode") this._updateMode();
  }

  _updateMode() {
    if (!this._fields || !this._button) return;

    const readonly = this.mode === "view";
    this._fields.forEach((f) => (f.disabled = readonly));
    this._button.style.display = readonly ? "none" : "inline-block";
  }

  get value() {
    const fields = this._fields;
    return {
      id: fields[0].value,
      name: fields[1].value,
      description: fields[2].value,
      date_created: fields[3].value,
      period: fields[4].value,
      date_ended: fields[5].value,
      url_link: fields[6].value,
    };
  }

  set value(data) {
    if (!this._fields) return;
    Object.values(data).forEach((v, i) => {
      if (this._fields[i]) this._fields[i].value = v;
    });
  }
}

customElements.define("product-form", ProductForm);
