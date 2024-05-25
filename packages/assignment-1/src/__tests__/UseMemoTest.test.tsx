import { expect, test, vi } from 'vitest'
import { act, fireEvent, render } from "@testing-library/react";
import * as utils from '../utils';
import UseMemoTest from "../UseMemoTest.tsx";


test('useMemo를 사용하여 불필요한 연산을 방지한다.', async () => {
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
