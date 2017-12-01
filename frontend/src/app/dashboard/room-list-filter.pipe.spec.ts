import { RoomListFilterPipe } from './room-list-filter.pipe';
import { Room } from "../models/room"

describe('RoomListFilterPipe', () => {
  let pipe = new RoomListFilterPipe();
  let rooms : Room[] = <Room[]> [
    {
      name: 'SNU Meeting',
      place: 'SNU 301 Building'
    },
    {
      name: 'Pizza Party',
      place: 'Pizza Hut'
    },
    {
      name: 'Birthday Party',
      place: "Ashley's"
    },
    {
      name: 'Group Study Meeting',
      place: "SNU Library"
    }
  ];
  it('filters rooms correctly with "All" option', () => {
    {
      let filtered = pipe.transform(rooms, 'SNU', 'All');
      expect(filtered.length).toBe(2);
      expect(filtered).toContain(rooms[0]);
      expect(filtered).toContain(rooms[3]);
    }
    {
      let filtered = pipe.transform(rooms, 'Party', 'All');
      expect(filtered.length).toBe(2);
      expect(filtered).toContain(rooms[1]);
      expect(filtered).toContain(rooms[2]);
    }
  });

  it('filters rooms correctly with "Name" option', () => {
    {
      let filtered = pipe.transform(rooms, 'Party', 'Name');
      expect(filtered.length).toBe(2);
      expect(filtered).toContain(rooms[1]);
      expect(filtered).toContain(rooms[2]);
    }
    {
      let filtered = pipe.transform(rooms, 'SNU', 'Name');
      expect(filtered.length).toBe(1);
      expect(filtered).toContain(rooms[0]);
    }
  });

  it('filters rooms correctly with "Location" option', () => {
    {
      let filtered = pipe.transform(rooms, "Ashley's", 'Location');
      expect(filtered.length).toBe(1);
      expect(filtered).toContain(rooms[2]);
    }
    {
      let filtered = pipe.transform(rooms, "SNU", 'Location');
      expect(filtered.length).toBe(2);
      expect(filtered).toContain(rooms[0]);
      expect(filtered).toContain(rooms[3]);
    }
  })

});
