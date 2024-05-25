import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from "@testing-library/react";
import * as utils from '../utils';
import UseMemoTest from "../UseMemoTest.tsx";
import UseStateTest from "../UseStateTest.tsx";
import PureComponentTest from "../PureComponentTest.tsx";

beforeEach(() => {
  vi.clearAllMocks();
})

describe('다양한 hook을 이용하여 테스트코드를 통과할 수 있도록 해봅시다.', () => {
  describe('useState > ', () => {
    test('setState의 내용을 개선하여, 증가 버튼을 누르면 count의 값이 증가하도록 한다.', () => {
      render(<UseStateTest/>);

      expect(document.body.innerHTML).toBe('<div><div>count: 1<button>증가</button></div></div>');

      act(() => {
        fireEvent.click(screen.getByText('증가'))
      })

      expect(document.body.innerHTML).toBe('<div><div>count: 2<button>증가</button></div></div>');
    })
  })

  describe('useMemo > ', () => {
    test('useMemo를 사용하여 불필요한 값 연산을 방지한다.', async () => {
      const spyRepeatMeow = vi.spyOn(utils, 'repeatMeow');
      const spyRepeatBarked = vi.spyOn(utils, 'repeatBarked');

      const { findByTestId } = render(<UseMemoTest/>);

      const $cat = await findByTestId('cat');
      const $dog = await findByTestId('dog');
      const $meowHandler = await findByTestId('meow');
      const $barkHandler = await findByTestId('bark');
      expect($cat.innerHTML).toBe('고양이 "냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($meowHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($barkHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍멍"');

      expect(spyRepeatMeow).toHaveBeenCalledTimes(2);
      expect(spyRepeatBarked).toHaveBeenCalledTimes(2);
    })

    test('PureComponent를 사용하여 불필요한 렌더링을 방지한다.', async () => {
      const spyRepeatMeow = vi.spyOn(utils, 'repeatMeow');
      const spyRepeatBarked = vi.spyOn(utils, 'repeatBarked');

      const { findByTestId } = render(<PureComponentTest/>);

      const $cat = await findByTestId('cat');
      const $dog = await findByTestId('dog');
      const $meowHandler = await findByTestId('meow');
      const $barkHandler = await findByTestId('bark');
      expect($cat.innerHTML).toBe('고양이 "냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($meowHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍"');

      act(() => {
        fireEvent.click($barkHandler);
      })

      expect($cat.innerHTML).toBe('고양이 "냥냥"');
      expect($dog.innerHTML).toBe('강아지 "멍멍"');

      expect(spyRepeatMeow).toHaveBeenCalledTimes(2);
      expect(spyRepeatBarked).toHaveBeenCalledTimes(2);
    })
  })
})
