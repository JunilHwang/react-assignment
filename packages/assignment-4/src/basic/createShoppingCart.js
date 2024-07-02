export const createShoppingCart = () => {
  const items = {};

  const addItem = (product, quantity = 1) => {
    if (items[product.id]) {
      items[product.id].quantity += quantity;
    } else {
      items[product.id] = { product, quantity };
    }
  };

  const removeItem = (productId) => {
    delete items[productId];
  };

  const updateQuantity = (productId, quantity) => {
    if (!items[productId]) {
      return;
    }
    items[productId].quantity = Math.max(0, quantity);
    if (items[productId].quantity === 0) {
      removeItem(productId);
    }
  };

  const getItems = () => Object.values(items);

  const getTotal = () => getItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
