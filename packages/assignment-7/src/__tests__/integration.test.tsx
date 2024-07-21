import { describe, test } from 'vitest';

describe('통합 테스트: 회사 미팅 일정 관리 시나리오', () => {
  test.fails('1. 새로운 주간 회의 일정을 추가한다');
  test.fails('2. 추가된 일정을 조회하고 정보를 확인한다');
  test.fails('3. 회의 시간을 10시 30분으로 수정한다');
  test.fails('4. 수정된 일정을 확인한다');
  test.fails('5. 이번 주 회의를 휴가로 인해 건너뛴다 (해당 주의 일정만 삭제)');
  test.fails('6. 삭제된 일정을 확인하고 다음 주 일정이 여전히 존재하는지 확인한다');
  test.fails('7. 한 달 뒤의 특정 회의에 외부 참가자를 추가한다');
  test.fails('8. 수정된 특정 회의 일정을 확인한다');
});
