// /js/app.js
export function menuApp() {
  const items = [
    {
      id: 1,
      cat: "Starters",
      name: "Avocado Toast",
      desc: "Sourdough, lime, chili",
      price: 8,
    },
    {
      id: 2,
      cat: "Starters",
      name: "Tomato Soup",
      desc: "Roasted tomatoes, basil",
      price: 7,
    },
    {
      id: 3,
      cat: "Mains",
      name: "Grilled Salmon",
      desc: "Lemon butter, greens",
      price: 18,
    },
    {
      id: 4,
      cat: "Mains",
      name: "Mushroom Risotto",
      desc: "Arborio, parmesan",
      price: 16,
    },
    {
      id: 5,
      cat: "Desserts",
      name: "Chocolate Tart",
      desc: "Dark chocolate, cream",
      price: 9,
    },
    {
      id: 6,
      cat: "Drinks",
      name: "Lemonade",
      desc: "Fresh squeezed",
      price: 4,
    },
  ];

  return {
    /* ---------------- UI State ---------------- */
    search: "",
    category: "All",
    cart: [],

    /* ---------------- Derived State ---------------- */
    get categories() {
      return ["All", ...new Set(items.map((i) => i.cat))];
    },

    get filteredItems() {
      return items.filter(
        (i) =>
          (this.category === "All" || i.cat === this.category) &&
          i.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    get total() {
      return this.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    /* ---------------- Actions ---------------- */
    addToCart(item) {
      const found = this.cart.find((i) => i.id === item.id);
      found ? found.qty++ : this.cart.push({ ...item, qty: 1 });
    },

    incQty(id) {
      const item = this.cart.find((i) => i.id === id);
      if (item) item.qty++;
    },

    decQty(id) {
      const item = this.cart.find((i) => i.id === id);
      if (!item) return;
      item.qty > 1 ? item.qty-- : this.cart.splice(this.cart.indexOf(item), 1);
    },

    /* ---------------- Side Effects ---------------- */
    async submitOrder() {
      const payload = {
        items: this.cart,
        total: this.total,
        createdAt: new Date().toISOString(),
      };

      // Backend hook
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Order submitted!");
      this.cart = [];
    },
  };
}
