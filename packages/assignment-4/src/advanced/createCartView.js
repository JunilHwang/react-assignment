import { CartItem, CartTotal, MainLayout } from './templates.js';
import { Selectors } from "./selectors.js";

export const createCartView = ({ items, addItem, getItems, updateQuantity, getTotal, removeItem }) => {

  const renderInitialLayout = () => {
    document.getElementById('app').innerHTML = MainLayout({ items });
  };

  const addToCart = () => {
    const selectedProductId = document.getElementById(Selectors.Ids.PRODUCT_SELECT).value;
    const selectedProduct = items.find(p => p.id === selectedProductId);
    if (selectedProduct) {
      addItem(selectedProduct);
      renderCart();
    }
  };

  const changeQuantity = (productId, change) => {
    const item = getItems().find(item => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + change);
      renderCart();
    }
  };

  const renderCartItems = () => {
    document.getElementById(Selectors.Ids.CART_ITEMS).innerHTML = getItems().map(CartItem).join('');
  };

  const renderCart = () => {
    renderCartItems();
    const { total, discountRate } = getTotal();
    document.getElementById(Selectors.Ids.CART_TOTAL).innerHTML = CartTotal({ total, discountRate });
  };

  const setupEventListeners = () => {
    document.getElementById(Selectors.Ids.ADD_TO_CART).addEventListener('click', addToCart);
    document.getElementById(Selectors.Ids.CART_ITEMS).addEventListener('click', (e) => {
      const productId = e.target.dataset.productId;
      if (e.target.classList.contains('quantity-change')) {
        changeQuantity(productId, parseInt(e.target.dataset.change));
      } else if (e.target.classList.contains('remove-item')) {
        removeItem(productId);
        renderCart();
      }
    });
  };

  const init = () => {
    renderInitialLayout();
    setupEventListeners();
    renderCart();
  };

  return { init };
};
