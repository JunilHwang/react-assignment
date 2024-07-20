import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import App from '../App'
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest'
import { mockApiHandlers } from "../mockApiHandlers.ts";

const server = setupServer(...mockApiHandlers);

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('할 일 목록 통합테스트', async () => {
  render(<App/>)

  // 1. 초기 할 일 목록이 올바르게 렌더링되는지 확인
  await waitFor(() => {
    expect(screen.getByText('테스트 할 일 1')).toBeInTheDocument()
    expect(screen.getByText('테스트 할 일 2')).toBeInTheDocument()
  })

  // 2. 새로운 할 일을 추가할 수 있는지 확인
  const input = screen.getByPlaceholderText('새 할 일')
  const addButton = screen.getByText('추가')

  await userEvent.type(input, '새로운 할 일')
  await userEvent.click(addButton)

  await waitFor(() => {
    expect(screen.getByText('새로운 할 일')).toBeInTheDocument()
  })

  // 3. 할 일의 완료 상태를 토글할 수 있는지 확인
  const firstTodoCheckbox = screen.getAllByRole('checkbox')[0]
  await userEvent.click(firstTodoCheckbox)

  await waitFor(() => {
    const todoText = screen.getByText('테스트 할 일 1')
    expect(todoText).toHaveStyle('text-decoration: line-through')
  })

  // 4. 할 일을 삭제할 수 있는지 확인
  const deleteButtons = screen.getAllByText('삭제')
  await userEvent.click(deleteButtons[0])

  await waitFor(() => {
    expect(screen.queryByText('테스트 할 일 1')).not.toBeInTheDocument()
  })
})
