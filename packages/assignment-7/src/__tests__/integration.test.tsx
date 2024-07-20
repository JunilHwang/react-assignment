import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const events = [
  {
    id: 1,
    title: "기존 회의",
    date: "2024-07-15",
    startTime: "09:00",
    endTime: "10:00",
    description: "기존 팀 미팅",
    location: "회의실 B",
    category: "업무",
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  }
];

const handlers = [
  // GET 요청 처리
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  // POST 요청 처리 (이벤트 추가)
  http.post('/api/events', async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newEvent = await request.json() as any;
    newEvent.id = events.length + 1;  // 간단한 ID 생성
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // PUT 요청 처리 (이벤트 수정)
  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedEvent = await request.json() as any;
    const index = events.findIndex(event => event.id === Number(id));
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      return HttpResponse.json(events[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE 요청 처리 (이벤트 삭제)
  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const index = events.findIndex(event => event.id === Number(id));
    if (index !== -1) {
      events.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('통합 테스트: 회사 미팅 일정 관리 시나리오', () => {
  test('회사 미팅 일정을 관리하는 전체 과정을 테스트한다', async () => {
    render(<App/>);

    const user = userEvent.setup();


    // 1. 새로운 주간 회의 일정 추가 (매주 월요일 오전 10시, 1시간 동안)
    const eventSubmitButton = await screen.findByTestId('event-submit-button');
    await user.type(screen.getByLabelText('제목'), '추가된 일정');
    await user.type(screen.getByLabelText('날짜'), '2024-07-22');
    await user.type(screen.getByLabelText('시작 시간'), '10:00');
    await user.type(screen.getByLabelText('종료 시간'), '11:00');
    await user.type(screen.getByLabelText('설명'), '주간 팀 미팅');
    await user.type(screen.getByLabelText('위치'), '회의실 A');
    await user.selectOptions(screen.getByLabelText('카테고리'), '업무');
    await user.click(screen.getByLabelText('반복 일정'));
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'weekly');
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.click(eventSubmitButton);

    // 2. 추가된 일정 조회 및 정보 확인
    expect(screen.getAllByText('추가된 일정').length).toBe(2);

    // 3. 회의 시간을 10시 30분으로 수정
    const editButton = screen.getAllByLabelText('Edit event')[1];

    await user.click(editButton);
    await user.clear(screen.getByLabelText('시작 시간'));
    await user.type(screen.getByLabelText('시작 시간'), '10:30');
    await user.click(eventSubmitButton);

    // 4. 수정된 일정 확인
    const eventList = screen.getByTestId('eventList');
    expect(eventList).toHaveTextContent('2024-07-22 10:30 - 11:00');


    // 5. 이번 주 회의를 휴가로 인해 건너뛰기 (해당 주의 일정만 삭제)
    expect(eventList).toHaveTextContent('기존 회의');
    const deleteButton = screen.getAllByLabelText('Delete event')[0];
    await user.click(deleteButton);

    // 6. 삭제된 일정 확인 및 다음 주 일정이 여전히 존재하는지 확인
    expect(eventList).not.toHaveTextContent('기존 회의');
    expect(eventList).toHaveTextContent('추가된 일정');

    // 7. 2번에서 추가된 회의에 외부 참가자 추가
    const editButtonNextMonth = await screen.findByLabelText('Edit event');
    await user.click(editButtonNextMonth);

    await user.clear(screen.getByLabelText('설명'));
    await user.type(screen.getByLabelText('설명'), '주간 팀 미팅 (외부 참가자: John Doe)');
    await user.click(eventSubmitButton);

    // 8. 수정된 특정 회의 일정 확인
    expect(screen.getByText('주간 팀 미팅 (외부 참가자: John Doe)')).toBeInTheDocument();
  });
});
