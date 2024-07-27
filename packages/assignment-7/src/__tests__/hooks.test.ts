import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCalendarView } from "../hooks/useCalendarView.ts";
import { Event } from "../types.ts";
import createMockServer from "./createMockServer.ts";
import { useEventOperations } from "../hooks/useEventOperations.ts";
import { http, HttpResponse } from "msw";

const MOCK_EVENT_1: Event = {
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

const events: Event[] = [{ ...MOCK_EVENT_1 }];

const server = createMockServer(events);

const mockToast = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => (props: never) => mockToast(props),
  };
});

beforeAll(() => server.listen());
afterAll(() => {
  server.close();
  vi.clearAllMocks();
});

describe('단위 테스트: 커스텀훅', () => {
  describe('useCalendarView > ', () => {
    test('초기 상태가 올바르게 설정되어야 한다', () => {
      const { result } = renderHook(() => useCalendarView());

      expect(result.current.view).toBe('month');
      expect(result.current.currentDate).toBeInstanceOf(Date);
      expect(result.current.holidays).toEqual({});
    });

    test('view를 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useCalendarView());

      act(() => {
        result.current.setView('week');
      });

      expect(result.current.view).toBe('week');
    });

    test('주간 뷰에서 다음으로 네비게이션하면 7일 후의 날짜여야 한다', () => {
      const { result } = renderHook(() => useCalendarView());
      const initialDate = new Date('2024-01-01');
      act(() => {
        result.current.setView('week');
        result.current.setCurrentDate(initialDate);
      });

      act(() => {
        result.current.navigate('next');
      });

      expect(result.current.currentDate).toEqual(new Date('2024-01-08'));
    });

    test('월간 뷰에서 이전으로 네비게이션하면 한 달 전의 날짜여야 한다', () => {
      const { result } = renderHook(() => useCalendarView());
      const initialDate = new Date('2024-03-15');
      act(() => {
        result.current.setCurrentDate(initialDate);
      });

      act(() => {
        result.current.navigate('prev');
      });

      expect(result.current.currentDate).toEqual(new Date('2024-02-15'));
    });

    test('currentDate가 변경되면 holidays가 업데이트되어야 한다', async () => {
      const { result } = renderHook(() => useCalendarView());

      act(() => {
        result.current.setCurrentDate(new Date('2024-10-01'));
      });

      expect(result.current.holidays).toEqual({
        "2024-10-03": "개천절",
        "2024-10-09": "한글날",
      });
    });
  });


  describe('useEventOperations > ', () => {

    describe('오류 케이스에 대한 테스트', () => {
      afterEach(() => server.resetHandlers()) // 각각 테스트 요청 마다 핸들러 초기화

      test('이벤트 로딩 실패 시 에러 토스트가 표시되어야 한다', async () => {
        server.use(
          http.get('/api/events', () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null));

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "이벤트 로딩 실패",
          status: "error",
        });
      });

      test('존재하지 않는 이벤트 수정 시 에러 처리가 되어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null));

        const nonExistentEvent: Event = {
          id: 999, // 존재하지 않는 ID
          title: "존재하지 않는 이벤트",
          date: "2024-07-20",
          startTime: "09:00",
          endTime: "10:00",
          description: "이 이벤트는 존재하지 않습니다",
          location: "어딘가",
          category: "기타",
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        };

        await act(async () => {
          await result.current.saveEvent(nonExistentEvent);
        });

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "일정 저장 실패",
          status: "error",
        });
      });

      test('네트워크 오류 시 이벤트 삭제가 실패해야 한다', async () => {
        server.use(
          http.delete('/api/events/:id', () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null));

        await act(async () => {
          await result.current.deleteEvent(1);
        });

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "일정 삭제 실패",
          status: "error",
        });
        expect(result.current.events).toHaveLength(1); // 삭제가 실패했으므로 이벤트가 그대로 남아있어야 함
      });
    });

    describe('정상적으로 동작하는 케이스에 대한 테스트 > ', () => {

      beforeEach(() => {
        events.length = 0;
        events.push({ ...MOCK_EVENT_1 })
      })

      test('초기 상태에서 이벤트를 정상적으로 불러와야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null))

        expect(result.current.events).toEqual(events);
      });

      test('새 이벤트를 추가할 수 있어야 한다. 이벤트를 추가할 때, ID는 서버에서 만들어준다.', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null))

        const newEvent: Event = {
          id: Date.now(),
          title: "새 회의",
          date: "2024-07-16",
          startTime: "11:00",
          endTime: "12:00",
          description: "새로운 팀 미팅",
          location: "회의실 A",
          category: "업무",
          repeat: { type: 'none', interval: 0 },
          notificationTime: 5,
        };

        await act(async () => {
          await result.current.saveEvent(newEvent);
        });

        expect(result.current.events).toEqual([
          events[0],
          {
            ...newEvent,
            id: 2, // 서버에서 할당된 ID
          }
        ])
      });

      test('기존 이벤트를 수정할 수 있어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null))

        const updatedEvent: Event = {
          ...events[0],
          title: "수정된 회의",
          endTime: "11:00",
        };

        await act(async () => {
          await result.current.saveEvent(updatedEvent);
        });

        expect(result.current.events[0]).toEqual(updatedEvent);
      });

      test('이벤트를 삭제할 수 있어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(async () => {
          await result.current.deleteEvent(1);
        });

        await act(() => Promise.resolve(null))

        expect(result.current.events).toEqual([]);
      });

    })
  });
})
