
export class Place {
  public name: string;
  public category: string;
  public latitude: number;
  public longitude: number;
  public url: string;

  constructor(name: string,
              category: string,
              latitude: string,
              longitude: string,
              url: string
  ) {
    this.name = name;
    this.category = category;
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.url = url;
  }
}
