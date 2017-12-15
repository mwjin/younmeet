import {Place} from "../models/place";

export interface  PlaceResponse {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

export function responseToPlace(res: PlaceResponse): Place {
  return new Place(
    res['place_name'],
    res['category_name'],
    res['y'],
    res['x'],
    res['place_url'],
    res['address_name'],
  );
}
