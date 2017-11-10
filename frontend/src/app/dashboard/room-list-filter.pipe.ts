import { Pipe, PipeTransform } from "@angular/core";
import {Room} from "../models/room";

@Pipe({
  name: 'roomListFilter'
})

export class RoomListFilterPipe implements PipeTransform {
  transform(items: Room[], searchText: string): Room[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText);
    })
  }
}
