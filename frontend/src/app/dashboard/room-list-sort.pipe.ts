import { Pipe, PipeTransform } from "@angular/core";
import {Room} from "../models/room";
import { FilterOptions } from './room-list-filter-options';
import { SortOptions } from './room-list-sort-options';

import * as moment from 'moment';

@Pipe({
  name: 'roomSorter'
})
export class RoomListSortPipe implements PipeTransform {
  transform(items: Room[], sortOption: SortOptions): Room[] {
    if (!items) return [];

    switch(sortOption) {
      case "Best Time":
        return items.concat().sort((room1, room2) =>
          moment(room1.bestTimespan.start).diff(room2.bestTimespan.start)
        );
      case "# Members":
        return items.concat().sort((room1, room2) =>
          room2.memberCount - room1.memberCount
        );
      case "Created Time":
        return items.concat().sort((room1, room2) =>
          moment(room1.createdTime).diff(room2.createdTime)
        );
    }
  }
}
