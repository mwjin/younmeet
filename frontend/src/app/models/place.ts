
export class Place {
  public name: string;
  public category: string;
  public latitude: number;
  public longitude: number;
  public url: string;
  public address_name: string;

  constructor(name = '',
              category = '',
              latitude = '',
              longitude = '',
              url = '',
              address_name = '',
  ) {
    this.name = name;
    this.category = category;
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.url = url;
    this.address_name = address_name;
  }
}
