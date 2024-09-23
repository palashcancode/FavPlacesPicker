// ../../models/place.js
export class Place {
    constructor(title, imageUri, location) {
      this.title = title;
      this.imageUri = imageUri;
      this.address = location.address;
      this.location = { lat: location.lat, lng: location.lng };
      this.id = new Date().toISOString() + Math.random().toString(); // Ensure unique IDs
    }
  }
  