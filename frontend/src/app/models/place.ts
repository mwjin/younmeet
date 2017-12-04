
export class Place {
  public name: string;
  public category: string;
  public latitude: number;
  public longitude: number;
  public url: string;

  constructor(name = '',
              category = '',
              latitude = '',
              longitude = '',
              url = ''
  ) {
    this.name = name;
    this.category = category;
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.url = url;
  }
}
