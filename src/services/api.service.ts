import { City, WeatherForecast } from "@/interfaces";
import { omit } from "@/utils";

class ApiService {
  private baseURL!: string;
  private apiKey!: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async getCity(
    query: string | null,
    coords?: { latitude: number; longitude: number }
  ) {
    const params = new URLSearchParams({
      appid: this.apiKey,
      ...(query && { q: query }),
      ...(coords && {
        lat: String(coords.latitude),
        lon: String(coords.longitude),
      }),
      limit: "1",
    });
    const response = await window.fetch(
      `${this.baseURL}/geo/1.0/direct?${params.toString()}`
    );
    const data: (City & { local_names: any })[] = await response.json();
    return data.map((value) => omit(value, "local_names"));
  }

  async getWeatherForecast(coords: Pick<City, "lat" | "lon">) {
    const params = new URLSearchParams({
      appid: this.apiKey,
      lat: String(coords.lat),
      lon: String(coords.lon),
      units: "metric",
    });
    const response = await window.fetch(
      `${this.baseURL}/data/2.5/weather?${params.toString()}`
    );
    const data: WeatherForecast = await response.json();
    return data;
  }
}

const apiService = new ApiService(
  import.meta.env.VITE_OPENWEATHER_API_BASEURL,
  import.meta.env.VITE_OPENWEATHER_API_KEY
);

export default apiService;
