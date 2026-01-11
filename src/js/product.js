export function productPage() {
  return {
    mode: 'create', // default
    modeTitle: 'Create Product',

    init() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const view = params.get('view');

      if (id) {
        this.mode = view === 'true' ? 'view' : 'edit';
        this.modeTitle = view === 'true' ? 'View Product' : 'Edit Product';
        this.loadProduct(id);
      }
    },

    async loadProduct(id) {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      this.$refs.form.value = data; // set data in web component
    },

    async save(product) {
      const method = this.mode === 'edit' ? 'PUT' : 'POST';
      const endpoint = this.mode === 'edit' ? `/api/products/${product.id}` : '/api/products';

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      alert('Product saved!');
    }
  };
}
