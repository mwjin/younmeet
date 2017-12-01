import { Besttime } from './besttime';
import { Timespan } from './timespan';
import { PartialAttendInfo } from './partial-attend-info';

describe('PartialAttendInfo model', () => {
  let timespan1 = new Timespan(
    new Date("December 1, 2017 13:10:00"),
    new Date("December 1, 2017 14:40:00"),
  );
  let timespan2 = new Timespan(
    new Date("December 1, 2017 1:50:00"),
    new Date("December 1, 2017 10:34:00"),
  );
  let paInfo1 = new PartialAttendInfo('lasagnaphil', timespan1);
  let paInfo2 = new PartialAttendInfo('lasagnaphil', timespan2);

  describe('getStartTime', () => {
    it('returns correct start time string', () => {
      expect(paInfo1.getStartTime()).toEqual("1:10 PM");
      expect(paInfo2.getStartTime()).toEqual("1:50 AM");
    });
  });

  describe('getEndTime', () => {
    it('returns correct end time string', () => {
      expect(paInfo1.getEndTime()).toEqual("2:40 PM");
      expect(paInfo2.getEndTime()).toEqual("10:34 AM");
    })
  });
});
