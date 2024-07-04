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

  const calculateDiscount = (item) => {
    const { product: { discount }, quantity } = item;

    if (!discount) return 0;

    for (const [minQuantity, discountRate] of discount) {
      if (quantity >= minQuantity) {
        return discountRate;
      }
    }

    return 0;
  };


  const getTotalQuantity = () => getItems().reduce((sum, item) => sum + item.quantity, 0);

  const getTotal = () => {
    const totalQuantity = getTotalQuantity();
    const bulkDiscount = totalQuantity >= 30 ? 0.25 : 0;

    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    getItems().forEach(item => {
      const itemDiscount = Math.max(calculateDiscount(item), bulkDiscount);
      const itemTotal = item.product.price * item.quantity;
      totalBeforeDiscount += itemTotal;
      totalAfterDiscount += itemTotal * (1 - itemDiscount);
    });

    const overallDiscount = 1 - (totalAfterDiscount / totalBeforeDiscount);

    return {
      total: Math.round(totalAfterDiscount),
      discountRate: overallDiscount
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};
