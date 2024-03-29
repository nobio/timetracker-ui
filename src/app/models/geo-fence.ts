export class GeoFence {
   id: string;
   enabled: boolean;
   longitude: number;
   latitude: number;
   radius: number;
   description: string;
   isCheckedIn: boolean = false;
   lastChange: Date;

   constructor(id: string = '', enabled = false, longitude: number = 0, latitude: number = 0, radius: number = 0, description: string = '', isCheckedIn: boolean = false, lastChange: Date = new Date) {
      this.id = id;
      this.enabled = enabled;
      this.longitude = longitude;
      this.latitude = latitude;
      this.radius = radius;
      this.description = description;
      this.isCheckedIn = isCheckedIn;
      this.lastChange = lastChange;
   }
}
