import { describe, expect, test } from "vitest";
import { formatMonth, formatWeek, getDaysInMonth, getWeekDates, isDateInRange } from "../utils";
import { convertEventToDateRange, findOverlappingEvents, isOverlapping, parseDateTime } from "../utils/eventOverlap.ts"; // 이 함수들이 정의된 파일을 import 해야 합니다.
import { Event } from "../types";
import { getTimeErrorMessage } from "../utils/timeValidation.ts";

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 1)).toBe(31); // 1월
      expect(getDaysInMonth(2024, 2)).toBe(29); // 윤년의 2월
      expect(getDaysInMonth(2023, 2)).toBe(28); // 평년의 2월
      expect(getDaysInMonth(2024, 4)).toBe(30); // 4월
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-07-10'); // 수요일
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-07-08'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-07-14'); // 일요일
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2024-12-30'); // 월요일
      const weekDates = getWeekDates(date);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-12-30'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2025-01-05'); // 일요일
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-10');
      expect(formatWeek(date)).toBe('2024년 7월 2주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-10');
      expect(formatMonth(date)).toBe('2024년 7월');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const date = new Date('2024-07-10');
      const rangeStart = new Date('2024-07-01');
      const rangeEnd = new Date('2024-07-31');
      expect(isDateInRange(date, rangeStart, rangeEnd)).toBe(true);

      const outOfRangeDate = new Date('2024-08-01');
      expect(isDateInRange(outOfRangeDate, rangeStart, rangeEnd)).toBe(false);
    });
  });


  describe('eventOverlap 유틸리티 함수 테스트', () => {
    describe('parseDateTime 함수', () => {
      test('날짜와 시간 문자열을 Date 객체로 정확히 변환해야 한다', () => {
        const result = parseDateTime('2023-05-01', '14:30');
        expect(result).toEqual(new Date('2023-05-01T14:30:00'));
      });
    });

    describe('convertEventToDateRange 함수', () => {
      test('이벤트 객체를 시작 시간과 종료 시간을 가진 객체로 변환해야 한다', () => {
        const event: Event = {
          id: 1,
          date: '2023-05-01',
          startTime: '14:30',
          endTime: '15:30',
          title: '테스트 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = convertEventToDateRange(event);
        expect(result.start).toEqual(new Date('2023-05-01T14:30:00'));
        expect(result.end).toEqual(new Date('2023-05-01T15:30:00'));
      });
    });

    describe('isOverlapping 함수', () => {
      test('두 이벤트가 겹치는 경우 true를 반환해야 한다', () => {
        const event1: Event = {
          id: 1, date: '2023-05-01', startTime: '14:00', endTime: '16:00',
          title: '이벤트 1', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        const event2: Event = {
          id: 2, date: '2023-05-01', startTime: '15:00', endTime: '17:00',
          title: '이벤트 2', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        expect(isOverlapping(event1, event2)).toBe(true);
      });

      test('두 이벤트가 겹치지 않는 경우 false를 반환해야 한다', () => {
        const event1: Event = {
          id: 1, date: '2023-05-01', startTime: '14:00', endTime: '16:00',
          title: '이벤트 1', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        const event2: Event = {
          id: 2, date: '2023-05-01', startTime: '16:00', endTime: '18:00',
          title: '이벤트 2', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        expect(isOverlapping(event1, event2)).toBe(false);
      });
    });

    describe('findOverlappingEvents 함수', () => {
      test('새 이벤트와 겹치는 모든 이벤트를 반환해야 한다', () => {
        const events: Event[] = [
          {
            id: 1,
            date: '2023-05-01',
            startTime: '10:00',
            endTime: '12:00',
            title: '이벤트 1',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 2,
            date: '2023-05-01',
            startTime: '11:00',
            endTime: '13:00',
            title: '이벤트 2',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 3,
            date: '2023-05-01',
            startTime: '15:00',
            endTime: '16:00',
            title: '이벤트 3',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
        ];
        const newEvent: Event = {
          id: 4,
          date: '2023-05-01',
          startTime: '11:30',
          endTime: '14:30',
          title: '새 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = findOverlappingEvents(newEvent, events);
        expect(result).toEqual([events[0],events[1]]);
      });

      test('겹치는 이벤트가 없으면 빈 배열을 반환해야 한다', () => {
        const events: Event[] = [
          {
            id: 1,
            date: '2023-05-01',
            startTime: '10:00',
            endTime: '12:00',
            title: '이벤트 1',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 2,
            date: '2023-05-01',
            startTime: '14:00',
            endTime: '16:00',
            title: '이벤트 2',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
        ];
        const newEvent: Event = {
          id: 3,
          date: '2023-05-01',
          startTime: '12:00',
          endTime: '14:00',
          title: '새 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = findOverlappingEvents(newEvent, events);
        expect(result).toHaveLength(0);
      });
    });
  });


  describe('timeValidation 유틸리티 함수 테스트', () => {
    describe('getTimeErrorMessage 함수', () => {
      test('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환해야 한다', () => {
        const result = getTimeErrorMessage('14:00', '13:00');
        expect(result.startTimeError).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
        expect(result.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
      });

      test('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환해야 한다', () => {
        const result = getTimeErrorMessage('14:00', '14:00');
        expect(result.startTimeError).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
        expect(result.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
      });

      test('시작 시간이 종료 시간보다 빠를 때 null을 반환해야 한다', () => {
        const result = getTimeErrorMessage('13:00', '14:00');
        expect(result.startTimeError).toBeNull();
        expect(result.endTimeError).toBeNull();
      });

      test('시작 시간이나 종료 시간이 비어있을 때 null을 반환해야 한다', () => {
        const result1 = getTimeErrorMessage('', '14:00');
        expect(result1.startTimeError).toBeNull();
        expect(result1.endTimeError).toBeNull();

        const result2 = getTimeErrorMessage('13:00', '');
        expect(result2.startTimeError).toBeNull();
        expect(result2.endTimeError).toBeNull();

        const result3 = getTimeErrorMessage('', '');
        expect(result3.startTimeError).toBeNull();
        expect(result3.endTimeError).toBeNull();
      });
    });
  });
});
