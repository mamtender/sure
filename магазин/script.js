//массив товаров
const products = [
  { id: 1, title: "Коричневая базовая футболка oversize", price: 1500, category: "Футболки и топы", image: "./assets/img/tShirt1.png" },
  { id: 2, title: "Джинсы BaggyJeans с эффектом спрея", price: 3700, category: "Джинсы", image: "./assets/img/jeans1.png" },
  { id: 3, title: "Чёрный базовый кроп-топ в рубчик", price: 1000, category: "Футболки и топы", image: "./assets/img/tShirt4.png" },
  { id: 4, title: "Чёрные джинсы Wide leg расклешенные", price: 4599, category: "Джинсы", image: "./assets/img/jeans3.png" },
  { id: 5, title: "Бежевая майка в рубчик с эффектом варки", price: 1299, category: "Футболки и топы", image: "./assets/img/tShirt2.png" },
  { id: 6, title: "Облегающий кроп-топ с воротником-стойкой", price: 899, category: "Футболки и топы", image: "./assets/img/tShirt3.png" },
  { id: 7, title: "Джинсы Wide leg с потёртостями на коленях", price: 4499, category: "Джинсы", image: "./assets/img/jeans4.png" },
  { id: 8, title: "Широкие серые джинсы Wide leg на высокой талии", price: 4000, category: "Джинсы", image: "./assets/img/jeans2.png" }
];

//корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('cardsContainer')) {
    initCatalogPage();
  }
  if (document.getElementById('shooseCardContainer')) {
    initCartPage();
  }
});

function initCatalogPage() {
  renderProducts(products);
  //фильтр
  const filterSelect = document.getElementById('serviceType');
  if (filterSelect) {
    filterSelect.addEventListener('change', function() {
      const category = this.value;
      const filteredProducts = (category === 'all' || category === '') 
        ? products 
        : products.filter(p => p.category === category);
      renderProducts(filteredProducts);
    });
  }
  //поиск
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm)
      );
      renderProducts(filteredProducts);
    });
  }
}

function initCartPage() {
  renderCart();
  //обновление корзины при изменении кол-ва
  document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="number"]')) {
      const productId = parseInt(e.target.dataset.id);
      const quantity = parseInt(e.target.value);
      changeQuantity(productId, quantity);
    }
  });
  
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId);
    }
  });
}

function renderProducts(productsToRender) {
  const container = document.getElementById('cardsContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  productsToRender.forEach(product => {
    const isInCart = cart.some(item => item.id === product.id);
    const buttonText = isInCart ? 'В корзине' : 'В корзину';
    const buttonClass = isInCart ? 'in-cart' : 'add-to-cart';
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="card-body">
        <h2>${product.title}</h2>
        <h3>${product.price} руб.</h3>
        <button class="${buttonClass}" data-id="${product.id}">${buttonText}</button>
      </div>
    `;
    container.appendChild(card);
  });
  //обработчики для кнопок
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.dataset.id);
      addToCart(productId);
      this.textContent = 'В корзине';
      this.classList.remove('add-to-cart');
      this.classList.add('in-cart');
    });
  });
}

function renderCart() {
  const container = document.getElementById('shooseCardContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <div class="description">
            <h2>${item.title}</h2>
            <h3>${item.price} руб. × ${item.quantity}</h3>
          </div>
          <div class="cart-item-controls">
            <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
            <button class="remove-btn" data-id="${item.id}">Удалить</button>
          </div>
        </div>
      `;
      container.appendChild(cartItem);
    });
  }
  
  updateCartSummary();
}
//функция обновления итоговой инф.
function updateCartSummary() {
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  document.getElementById('totalPrise').textContent = `${totalPrice} руб`;
  document.getElementById('countOfProducts').textContent = totalCount;
}
//функция добавления в корзину
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
}
//функция удаления товара из корзины
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}
//функция изменеия кол-ва товаров в корзине
function changeQuantity(productId, quantity) {
  if (quantity < 1) return;
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
    updateCartSummary();
  }
}
//функция сохранения корзины
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}