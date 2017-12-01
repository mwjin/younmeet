import { Besttime } from './besttime';

describe('Besttime model', () => {
  let besttime1 = new Besttime(
    new Date("December 1, 2017 13:10:00"),
    new Date("December 1, 2017 14:40:00"),
    [],
    []
  );
  let besttime2 = new Besttime(
    new Date("December 1, 2017 1:50:00"),
    new Date("December 1, 2017 10:34:00"),
    [],
    []
  );
  let besttime3 = new Besttime(
    new Date("December 1, 2017 1:50:00"),
    new Date("December 1, 2017 3:50:00"),
    [],
    []
  );

  describe('getDate', () => {
    it('returns correct date string tuple', () => {
      expect(besttime1.getDate()).toEqual(["December 1st (Friday)", "December 1st (Friday)"])
    });
  });

  describe('getStartTime', () => {
    it('returns correct start time string', () => {
      expect(besttime1.getStartTime()).toEqual("1:10 PM");
      expect(besttime2.getStartTime()).toEqual("1:50 AM");
    });
  });

  describe('getEndTime', () => {
    it('returns correct end time string', () => {
      expect(besttime1.getEndTime()).toEqual("2:40 PM");
      expect(besttime2.getEndTime()).toEqual("10:34 AM");
    })
  });

  describe('getDuration', () => {
    it('returns correct duration string', () => {
      expect(besttime1.getDuration()).toEqual("1 hour, 30 minutes");
      expect(besttime2.getDuration()).toEqual("8 hours, 44 minutes");
      expect(besttime3.getDuration()).toEqual("2 hours");
    });
  })
});
