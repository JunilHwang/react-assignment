import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { useMyRef } from "../useMyRef.ts";

beforeEach(() => {
  vi.clearAllMocks();
})

describe('useRef > ', () => {

  test('useRef와 똑같이 동작하는 useMyRef를 만들어서 사용할 수 있다.', () => {
    let currentRef: { current: null | HTMLDivElement } = { current: null }
    let expected = false;
    const UseMyRefTest = () => {
      const [, rerender] = useState({});
      // useRef로 변경해서 테스트하면 통과됩니다. useMyRef를 useRef와 똑같이 동작하도록 구현해보세요.
      const ref = useMyRef<HTMLDivElement>(null);
      expected = currentRef === ref;
      if (!expected) {
        currentRef = ref;
      }

      return (
        <div ref={ref}>
          <button onClick={() => rerender({})}>rerender</button>
        </div>
      )
    }


    const { getByText } = render(<UseMyRefTest/>);

    expect(expected).toBe(false);
    expect(currentRef.current?.outerHTML).toBe('<div><button>rerender</button></div>');

    act(() => {
      fireEvent.click(getByText('rerender'));
    })

    expect(expected).toBe(true);
  })
})
