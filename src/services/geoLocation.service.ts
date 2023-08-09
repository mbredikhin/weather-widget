import { City } from "../interfaces";

class GeoLocationService {
  options!: PositionOptions;

  constructor(options: PositionOptions) {
    this.options = options;
  }

  getCurrentLocation(
    successCallback: PositionCallback,
    errorCallback: PositionErrorCallback
  ): void {
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      this.options
    );
  }
}

const geoLocationService = new GeoLocationService({
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
});
export default geoLocationService;
