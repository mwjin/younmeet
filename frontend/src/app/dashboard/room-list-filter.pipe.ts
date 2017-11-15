import { Pipe, PipeTransform } from "@angular/core";
import {Room} from "../models/room";

export type FilterOptions = "All" | "Name" | "Location";

@Pipe({
  name: 'roomListFilter'
})
export class RoomListFilterPipe implements PipeTransform {
  transform(items: Room[], searchText: string, searchOption: FilterOptions): Room[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    switch(searchOption) {
      case "All":
        return items.filter(it =>
          it.name.toLowerCase().includes(searchText) ||
          it.place.toLowerCase().includes(searchText)
        );
      case "Name":
        return items.filter(it =>
          it.name.toLowerCase().includes(searchText)
        );
      case "Location":
        return items.filter(it =>
          it.place.toLowerCase().includes(searchText)
        );
      default:
        console.log(searchOption);
    }
  }
}
