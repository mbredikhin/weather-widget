<template>
  <div
    class="flex flex-col gap-2 transition ease-in-out delay-300 px-6 py-4 my-6 overflow-hidden border border-gray-50 rounded-lg shadow-md"
  >
    <div class="flex justify-between items-center">
      <div class="flex justify-between items-center">
        <h5 class="text-xl font-bold">
          {{ settings.display ? "Settings" : "Weather" }}
        </h5>
      </div>
      <button
        class="relative float-right w-10 inline-block p-2 bg-inherit border-none rounded-md hover:cursor-pointer focus:outline-none focus:ring hover:bg-gray-50"
        @click="updateSettings({ display: !settings.display })"
      >
        <img v-if="settings.display" alt="Hide settings" :src="closeIcon" />
        <img v-else alt="Show settings" :src="gearIcon" />
      </button>
    </div>

    <Settings
      v-if="settings.display"
      :cities="settings.cities"
      @updateCities="updateCities"
    ></Settings>
    <div v-else class="flex flex-col gap-2">
      <template v-for="(forecast, index) of weatherForecast" :key="forecast.id">
        <WeatherForecast :forecast="forecast"></WeatherForecast>
        <div class="divider" v-if="index < weatherForecast.length - 1"></div>
      </template>
    </div>
  </div>

  <Alert v-if="alerts.geolocation">
    We're unable to get your location at this moment, please specify your city
    in settings
  </Alert>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import storageService, { CITIES_STORAGE_KEY } from "@/services/storage.service";
import apiService from "@/services/api.service";
import geoLocationService from "@/services/geoLocation.service";
import { City, WeatherForecast as IWeatherForecast } from "@/interfaces";
import Settings from "@/components/Settings.vue";
import WeatherForecast from "@/components/WeatherForecast.vue";
import Alert from "@/components/Alert.vue";
import gearIcon from "@/assets/images/gear.svg";
import closeIcon from "@/assets/images/close.svg";

interface Settings {
  display: boolean;
  cities: City[];
}
interface Alerts {
  geolocation: boolean;
}

const services = {
  api: apiService,
  storage: storageService,
};
const settings = ref<Settings>({
  display: false,
  cities: [],
});
const weatherForecast = ref<IWeatherForecast[]>([]);
const alerts = ref<Alerts>({
  geolocation: false,
});

onBeforeMount(async () => {
  settings.value.cities =
    services.storage.get<City[]>(CITIES_STORAGE_KEY) ?? [];
  if (settings.value.cities.length) {
    return fetchWeatherForecast(settings.value.cities);
  }
  getUserLocation();
});

function getUserLocation() {
  geoLocationService.getCurrentLocation(
    async ({ coords }) => {
      const [city]: City[] = await services.api.getCity(null, coords);
      await fetchWeatherForecast([city]);
    },
    (error) => {
      console.warn(`ERROR(${error.code}): ${error.message}`);
      alerts.value.geolocation = true;
      setTimeout(() => (alerts.value.geolocation = false), 5 * 1000);
    }
  );
}

function updateSettings(payload: Partial<Settings>) {
  settings.value = {
    ...settings.value,
    ...payload,
  };
}

function updateCities(cities: City[]) {
  settings.value.cities = cities;
  services.storage.set<City[]>(CITIES_STORAGE_KEY, settings.value.cities);
  fetchWeatherForecast(settings.value.cities);
}

async function fetchWeatherForecast(coords: Pick<City, "lat" | "lon">[]) {
  weatherForecast.value = await Promise.all(
    coords.map((value) => services.api.getWeatherForecast(value))
  );
}
</script>

<style scoped></style>
