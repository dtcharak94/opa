export function initReviewManager() {
  const reviews = [
    {
      id: 1,
      menu: 'Caesar Salad',
      description: 'Fresh and crispy with perfect dressing. Highly recommend!',
      rating: 5,
      date: '2026-01-15'
    },
    {
      id: 2,
      menu: 'Margherita Pizza',
      description: 'Wood-fired perfection. The crust was amazing and ingredients were top quality.',
      rating: 5,
      date: '2026-01-14'
    },
    {
      id: 3,
      menu: 'Grilled Salmon',
      description: 'Cooked well but could use more seasoning.',
      rating: 3,
      date: '2026-01-12'
    }
  ];
  
  const menuInput = document.getElementById('menu');
  const descriptionInput = document.getElementById('description');
  const submitBtn = document.getElementById('submitBtn');
  const reviewsList = document.getElementById('reviewsList');
  const template = document.getElementById('reviewTemplate');
  
  function handleSubmit() {
    const menu = menuInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (menu && description) {
      const newReview = {
        id: reviews.length + 1,
        menu: menu,
        description: description,
        rating: 5,
        date: new Date().toISOString().split('T')[0]
      };
      
      reviews.unshift(newReview);
      menuInput.value = '';
      descriptionInput.value = '';
      renderReviews();
    }
  }
  
  function renderReviews() {
    reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
      const reviewElement = createReviewElement(review);
      reviewsList.appendChild(reviewElement);
    });
  }
  
  function createReviewElement(review) {
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('.review-menu').textContent = review.menu;
    clone.querySelector('.review-description').textContent = review.description;
    clone.querySelector('.review-date').textContent = review.date;
    
    const starsContainer = clone.querySelector('.stars');
    for (let i = 0; i < 5; i++) {
      const star = createStar(i < review.rating);
      starsContainer.appendChild(star);
    }
    
    return clone;
  }
  
  function createStar(filled) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `star ${filled ? 'filled' : 'empty'}`);
    svg.setAttribute('fill', filled ? 'currentColor' : 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('viewBox', '0 0 24 24');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z');
    
    svg.appendChild(path);
    return svg;
  }
  
  // Initialize
  submitBtn.addEventListener('click', handleSubmit);
  renderReviews();
  
  // Return public API if needed
  return {
    addReview: handleSubmit,
    getReviews: () => [...reviews]
  };
}