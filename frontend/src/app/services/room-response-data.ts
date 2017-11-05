import {Room} from "../models/room";
import {Timespan} from "../models/timespan";

export class RoomResponseData {
  id: number;
  name: string;
  place: string;
  best_start_time: Date;
  best_end_time: Date;
  min_time_required: number;
  user_ids: number[];
  created_time: Date;
  owner_id: number;

  static fromRoom(room: Room): RoomResponseData {
    return <RoomResponseData> {
      id: room.id,
      name: room.name,
      place: room.place,
      best_start_time: room.timespan.start,
      best_end_time: room.timespan.end,
      min_time_required: room.duration,
      user_ids: room.users.map(user => user.id),
      created_time: room.createdTime,
      owner_id: room.owner.id
    }
  }

  static toRoom(res: RoomResponseData): Room {
    let room = new Room(res.name,
      res.min_time_required,
      new Timespan(res.best_start_time, res.best_end_time),
      false,
      res.place,
      true,
      res.id
    );
    return room;
  }
}
