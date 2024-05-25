import { expect, test } from 'vitest'
import { act, fireEvent, render, screen } from "@testing-library/react";
import UseStateTest from '../UseStateTest';


test('adds 1 + 2 to equal 3', () => {
  render(<UseStateTest />);

  expect(document.body.innerHTML).toBe('<div><div>count: 1<button>증가</button></div></div>');

  act(() => {
    fireEvent.click(screen.getByText('증가'))
  })

  expect(document.body.innerHTML).toBe('<div><div>count: 2<button>증가</button></div></div>');
})
