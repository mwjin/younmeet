import { Room } from "../models/room"
import { RoomListSortPipe } from './room-list-sort.pipe';
import { Timespan } from '../models/timespan';

describe('RoomListSortPipe', () => {
  let pipe: RoomListSortPipe = new RoomListSortPipe();
  let rooms : Room[] = <Room[]> [
    {
      id: 0,
      name: 'SNU Meeting',
      place: 'SNU 301 Building',
      bestTimespan: new Timespan(
        new Date(2017, 11, 1, 0, 10), new Date(2017, 11, 1, 10, 0)
      ),
      createdTime: new Date(2017, 11, 9, 0, 0),
      memberCount: 7
    },
    {
      id: 1,
      name: 'Pizza Party',
      place: 'Pizza Hut',
      bestTimespan: new Timespan(
        new Date(2017, 11, 5, 2, 0), new Date(2017, 11, 5, 3, 0)
      ),
      createdTime: new Date(2017, 11, 10, 0, 0),
      memberCount: 2
    },
    {
      id: 2,
      name: 'Birthday Party',
      place: "Ashley's",
      bestTimespan: new Timespan(
        new Date(2017, 11, 17, 5, 0), new Date(2017, 11, 17, 8, 0)
      ),
      createdTime: new Date(2017, 11, 7, 0, 0),
      memberCount: 3
    },
    {
      id: 3,
      name: 'Group Study Meeting',
      place: "SNU Library",
      bestTimespan: new Timespan(
        new Date(2017, 11, 4, 8, 3), new Date(2017, 11, 4, 9, 0)
      ),
      createdTime: new Date(2017, 11, 8, 0, 0),
      memberCount: 9
    }
  ];
  it('filters rooms correctly with "Best Time" option', () => {
    {
      let sorted = pipe.transform(rooms, 'Best Time');
      console.log(sorted);
      expect(sorted[0].id).toBe(rooms[0].id);
      expect(sorted[1].id).toBe(rooms[3].id);
      expect(sorted[2].id).toBe(rooms[1].id);
      expect(sorted[3].id).toBe(rooms[2].id);
    }
  });

  it('filters rooms correctly with "Num. of Members" option', () => {
    {
      let sorted = pipe.transform(rooms, "Num. of Members");
      expect(sorted[0].id).toBe(rooms[3].id);
      expect(sorted[1].id).toBe(rooms[0].id);
      expect(sorted[2].id).toBe(rooms[2].id);
      expect(sorted[3].id).toBe(rooms[1].id);
    }
  });

  it('filters rooms correctly with "Created Time" option', () => {
    {
      let sorted = pipe.transform(rooms, "Created Time");
      expect(sorted[0].id).toBe(rooms[2].id);
      expect(sorted[1].id).toBe(rooms[3].id);
      expect(sorted[2].id).toBe(rooms[0].id);
      expect(sorted[3].id).toBe(rooms[1].id);
    }
  })

});
