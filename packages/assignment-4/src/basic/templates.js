import { Selectors } from "./selectors.js";

export const ProductOption = ({ id, name, price }) => `
  <option value="${id}">${name} - ${price}원</option>
`.trim();

export const MainLayout = ({ items }) => `
  <div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="${Selectors.Ids.CART_ITEMS}"></div>
        <div id="${Selectors.Ids.CART_TOTAL}" class="text-xl font-bold my-4"></div>
        <select id="${Selectors.Ids.PRODUCT_SELECT}" class="border rounded p-2 mr-2">
        ${items.map(ProductOption).join('')}
      </select>
        <button id="${Selectors.Ids.ADD_TO_CART}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>
`.trim();

export const CartItem = ({ product, quantity  }) => `
  <div class="flex justify-between items-center mb-2">
    <span>${product.name} - ${product.price}원 x ${quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>
  </div>
`.trim();
