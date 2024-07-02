import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { ProductOption, MainLayout, CartItem } from '../templates.js'
import { createShoppingCart } from "../createShoppingCart.js";

describe('basic test', () => {

  describe.each([
    { type: 'origin', loadFile: () => import('../../main.js'), },
    { type: 'basic', loadFile: () => import('../main.js'), },
  ])('$type 장바구니 시나리오 테스트', ({ loadFile }) => {

    beforeAll(async () => {
      // DOM 초기화
      document.body.innerHTML = '<div id="app"></div>';
      await loadFile();
    });

    it('장바구니 전체 기능 시나리오', async () => {
      // 초기 레이아웃 렌더링 확인
      expect(document.body.innerHTML).toContain('장바구니');
      expect(document.querySelector('#product-select')).not.toBeNull();
      expect(document.querySelector('#add-to-cart')).not.toBeNull();

      // 상품을 장바구니에 추가
      const select = document.querySelector('#product-select');
      const addButton = document.querySelector('#add-to-cart');

      select.value = 'p1';
      addButton.click();
      select.value = 'p2';
      addButton.click();
      select.value = 'p1';
      addButton.click();

      // 장바구니 내역 조회 및 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(2);
        expect(cartItems[0].textContent).toContain('상품1');
        expect(cartItems[0].textContent).toContain('x 2');
        expect(cartItems[1].textContent).toContain('상품2');
        expect(cartItems[1].textContent).toContain('x 1');
      });

      // 총액 계산 검증
      expect(document.querySelector('#cart-total').textContent).toBe('총액: 40000원');

      // 상품 수량 변경
      document.querySelectorAll('.quantity-change[data-change="1"]')[1].click();

      // 변경된 수량 및 총액 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems[1].textContent).toContain('x 2');
        expect(document.querySelector('#cart-total').textContent).toBe('총액: 60000원');
      });

      document.querySelectorAll('.quantity-change[data-change="1"]')[1].click();

      // 변경된 수량 및 총액 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems[1].textContent).toContain('x 3');
        expect(document.querySelector('#cart-total').textContent).toBe('총액: 80000원');
      });

      // 상품 제거
      const removeButton = document.querySelector('.remove-item[data-product-id="p1"]');
      removeButton.click();

      // 제거 후 장바구니 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].textContent).toContain('상품2');
        expect(document.querySelector('#cart-total').textContent).toBe('총액: 60000원');
      });

      // 수량을 0으로 변경하여 상품 제거
      for (let i = 0; i < 3; i++) {
        document.querySelector('.quantity-change[data-change="-1"]').click();
      }

      // 장바구니가 비어있는지 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(0);
        expect(document.querySelector('#cart-total').textContent).toBe('총액: 0원');
      });

      // 새로운 상품 추가
      select.value = 'p3';
      addButton.click();
      addButton.click();

      // 최종 장바구니 상태 검증
      await vi.waitFor(() => {
        const cartItems = document.querySelectorAll('#cart-items > div');
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].textContent).toContain('상품3');
        expect(cartItems[0].textContent).toContain('x 2');
        expect(document.querySelector('#cart-total').textContent).toBe('총액: 60000원');
      });
    });
  });

  describe('Templates > ', () => {
    describe('ProductOption', () => {
      it('props를 받아서 option 태그로 표현할 수 있다.', () => {
        const product = { id: 'p1', name: '상품1', price: 10000 };
        const result = ProductOption(product);
        expect(result).toBe('<option value="p1">상품1 - 10000원</option>');
      });
    });

    describe('MainLayout', () => {
      it('items를 토대로 렌더링할 수 있다.', () => {
        const items = [
          { id: 'id1', name: '테스트 상품 1', price: 100 },
          { id: 'id2', name: '테스트 상품 2', price: 200 }
        ];
        const result = MainLayout({ items });
        expect(result).toBe(`<div class="bg-gray-100 p-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2">
        <option value="id1">테스트 상품 1 - 100원</option><option value="id2">테스트 상품 2 - 200원</option>
      </select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    </div>
  </div>`);
      });
    });

    describe('CartItem', () => {
      it('상품 정보를 받아서 장바구니 UI로 표현한다.', () => {
        const item = { product: { id: 'p1', name: '상품1', price: 10000 }, quantity: 2 };
        const result = CartItem(item);
        expect(result).toBe(`<div class="flex justify-between items-center mb-2">
    <span>상품1 - 10000원 x 2</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="p1">삭제</button>
    </div>
  </div>`);
      });
    });
  });

  describe('createShoppingCart >', () => {
    let cart;

    beforeEach(() => {
      cart = createShoppingCart();
    });

    it('장바구니에 상품을 추가할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      expect(cart.getItems()).toEqual([{ product, quantity: 1 }]);
    });

    it('이미 존재하는 상품을 추가할 때 수량이 증가해야 한다', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.addItem(product);
      expect(cart.getItems()).toEqual([{ product, quantity: 2 }]);
    });

    it('장바구니에서 상품을 제거할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.removeItem('p1');
      expect(cart.getItems()).toHaveLength(0);
    });

    it('상품의 수량을 업데이트할 수 있다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.updateQuantity('p1', 3);
      expect(cart.getItems()[0].quantity).toBe(3);
    });

    it('수량이 0으로 업데이트될 때 해당 상품이 제거된다.', () => {
      const product = { id: 'p1', name: '상품1', price: 10000 };
      cart.addItem(product);
      cart.updateQuantity('p1', 0);
      expect(cart.getItems()).toHaveLength(0);
    });

    it('총액을 정확하게 계산해야 한다', () => {
      const product1 = { id: 'p1', name: '상품1', price: 10000 };
      const product2 = { id: 'p2', name: '상품2', price: 20000 };
      cart.addItem(product1);
      cart.addItem(product2, 2);
      expect(cart.getTotal()).toBe(50000);
    });
  });
})
