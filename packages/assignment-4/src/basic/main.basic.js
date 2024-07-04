const PRODUCTS = [
  {id: 'p1', name: '상품1', price: 10000},
  {id: 'p2', name: '상품2', price: 20000},
  {id: 'p3', name: '상품3', price: 30000}
];

const DISCOUNT_THRESHOLDS = {
  QUANTITY: 10,
  BULK: 30
};

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  BULK: 0.25
};

const SELECTORS = {
  APP: '#app',
  CART_ITEMS: '#cart-items',
  CART_TOTAL: '#cart-total',
  PRODUCT_SELECT: '#product-select',
  ADD_TO_CART: '#add-to-cart'
};

const CLASSES = {
  QUANTITY_CHANGE: 'quantity-change',
  REMOVE_ITEM: 'remove-item'
};

function createShoppingCart() {
  const cart = {};

  function addToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    renderCart();
  }

  function removeFromCart(productId) {
    if (!cart[productId]) return;
    cart[productId]--;
    if (cart[productId] === 0) {
      delete cart[productId];
    }
    renderCart();
  }

  function calculateDiscount(productId, quantity) {
    return quantity >= DISCOUNT_THRESHOLDS.QUANTITY ? (DISCOUNT_RATES[productId] || 0) : 0;
  }

  function calculateTotal() {
    const { totalBeforeDiscount, total, totalQuantity } = Object.entries(cart).reduce((acc, [productId, quantity]) => {
      const product = PRODUCTS.find(p => p.id === productId);
      const itemTotal = product.price * quantity;
      const discount = calculateDiscount(productId, quantity);
      acc.totalBeforeDiscount += itemTotal;
      acc.total += itemTotal * (1 - discount);
      acc.totalQuantity += quantity;
      return acc;
    }, { totalBeforeDiscount: 0, total: 0, totalQuantity: 0 });

    const bulkDiscount = totalQuantity >= DISCOUNT_THRESHOLDS.BULK ? DISCOUNT_RATES.BULK : 0;
    const finalTotal = Math.min(total, totalBeforeDiscount * (1 - bulkDiscount));
    const discountRate = (totalBeforeDiscount - finalTotal) / totalBeforeDiscount;

    return { total: Math.round(finalTotal), discountRate };
  }

  function renderCart() {
    const cartItemsHtml = Object.entries(cart).map(([productId, quantity]) => {
      const product = PRODUCTS.find(p => p.id === productId);
      return `
        <div class="flex justify-between items-center mb-2">
          <span>${product.name} - ${product.price}원 x ${quantity}</span>
          <div>
            <button class="${CLASSES.QUANTITY_CHANGE}" data-product-id="${productId}" data-change="-1">-</button>
            <button class="${CLASSES.QUANTITY_CHANGE}" data-product-id="${productId}" data-change="1">+</button>
            <button class="${CLASSES.REMOVE_ITEM}" data-product-id="${productId}">삭제</button>
          </div>
        </div>
      `;
    }).join('');

    const { total, discountRate } = calculateTotal();
    const cartTotalHtml = `
      <div class="text-xl font-bold my-4">
        총액: ${total}원
        ${discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}
      </div>
    `;

    document.querySelector(SELECTORS.CART_ITEMS).innerHTML = cartItemsHtml;
    document.querySelector(SELECTORS.CART_TOTAL).innerHTML = cartTotalHtml;
  }

  function initializeCart() {
    const appElement = document.querySelector(SELECTORS.APP);
    appElement.innerHTML = `
      <div class="bg-gray-100 p-8">
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items"></div>
          <div id="cart-total" class="text-xl font-bold my-4"></div>
          <select id="product-select" class="border rounded p-2 mr-2">
            ${PRODUCTS.map(product => `<option value="${product.id}">${product.name} - ${product.price}원</option>`).join('')}
          </select>
          <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        </div>
      </div>
    `;

    document.querySelector(SELECTORS.ADD_TO_CART).addEventListener('click', () => {
      const selectedProductId = document.querySelector(SELECTORS.PRODUCT_SELECT).value;
      addToCart(selectedProductId);
    });

    document.querySelector(SELECTORS.CART_ITEMS).addEventListener('click', (event) => {
      const target = event.target;
      if (!target.dataset.productId) return;

      if (target.classList.contains(CLASSES.QUANTITY_CHANGE)) {
        const change = parseInt(target.dataset.change);
        change === 1 ? addToCart(target.dataset.productId) : removeFromCart(target.dataset.productId);
      } else if (target.classList.contains(CLASSES.REMOVE_ITEM)) {
        delete cart[target.dataset.productId];
        renderCart();
      }
    });

    renderCart();
  }

  return { initializeCart };
}

const shoppingCart = createShoppingCart();
shoppingCart.initializeCart();
