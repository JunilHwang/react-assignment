import { describe, test, expect } from "vitest";
import { getDaysInMonth, getWeekDates, formatWeek, formatMonth, isDateInRange } from "../utils"; // 이 함수들이 정의된 파일을 import 해야 합니다.

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
});
