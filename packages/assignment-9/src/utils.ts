export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

export const parseSchedule = (schedule: string) => {
  const schedules = schedule.split('<p>');
  return schedules.map(schedule => {

    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const [day] = schedule.split(/(\d+)/);

    const range = [schedule.replace(reg, "$2")].map((v) => {
      const [start, end] = v.split("~").map(Number);
      if (end === undefined) return [start];
      return Array(end - start + 1)
        .fill(start)
        .map((v, k) => v + k);
    })[0] as number[];

    const room = schedule.replace(reg, "$4")?.replace(/\(|\)/g, "");

    return { day, range, room };
  });
};
