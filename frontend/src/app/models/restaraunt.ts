
export class Restaraunt {
  public name: string;
  public category: string;
  public latitude: number;
  public longitude: number;
  public phone: string;

  constructor(name: string,
              category: string,
              latitude: string,
              longitude: string,
              phone: string
  ) {
    this.name = name;
    this.category = category;
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.phone = phone;
  }
}
