export function orderPage() {
  return {
    mode: "create",
    modeTitle: "Create Order",

    init() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const view = params.get("view");

      if (id) {
        this.mode = view === "true" ? "view" : "edit";
        this.modeTitle = view === "true" ? "View Order" : "Edit Order";
        this.loadOrder(id);
      }
    },

    async loadOrder(id) {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      this.$refs.form.value = data;
    },

    async save(order) {
      const method = this.mode === "edit" ? "PUT" : "POST";
      const endpoint =
        this.mode === "edit" ? `/api/orders/${order.id}` : "/api/orders";

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      alert("Order saved!");
    },
  };
}
