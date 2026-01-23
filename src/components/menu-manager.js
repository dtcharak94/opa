export function menuManager() {
  return {
    showDisabled: false,
    categories: [
      {
        name: 'Appetizers',
        items: [
          { id: 1, name: 'Bruschetta', grams: 120, disabled: false },
          { id: 2, name: 'Spring Rolls', grams: 90, disabled: true }
        ]
      },
      {
        name: 'Main Dishes',
        items: [
          { id: 3, name: 'Grilled Chicken', grams: 350, disabled: false }
        ]
      }
    ],
    filteredItems(items) {
      return this.showDisabled ? items : items.filter(i => !i.disabled)
    },
    disableItem(item) {
      item.disabled = true
    },
    activateItem(item) {
      item.disabled = false
    },
    deleteItem(category, id) {
      category.items = category.items.filter(i => i.id !== id)
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
