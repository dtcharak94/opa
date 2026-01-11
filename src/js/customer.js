export function customerPage() {
  return {
    mode: 'create', // default
    modeTitle: 'Create Customer',

    init() {
      // detect edit/view via query param ?id=123&view=true
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const view = params.get('view');

      if (id) {
        this.mode = view === 'true' ? 'view' : 'edit';
        this.modeTitle = view === 'true' ? 'View Customer' : 'Edit Customer';
        this.loadCustomer(id);
      }
    },

    async loadCustomer(id) {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();

      this.$refs.form.value = data; // set data in web component
    },

    async save(customer) {
      // Save for create/edit
      const method = this.mode === 'edit' ? 'PUT' : 'POST';
      const endpoint = this.mode === 'edit' ? `/api/customers/${customer.id}` : '/api/customers';

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });

      alert('Customer saved!');
    }
  };
}
