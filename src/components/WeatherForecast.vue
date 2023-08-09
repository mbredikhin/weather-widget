<template>
  <div class="flex flex-col gap-2">
    <div>
      <span class="text-lg font-medium">
        {{ props.forecast.name }}, {{ props.forecast.sys.country }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <img
        class="inline-block w-20 h-20"
        :src="`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`"
        alt="Wind"
      />
      <span class="text-4xl font-bold"
        >{{ Math.round(props.forecast.main.temp) }}°C</span
      >
    </div>
    <div class="flex">
      <span class="text-sm">
        Feels like {{ Math.round(props.forecast.main.feels_like) }}°C.&nbsp;
      </span>
      <span
        class="text-sm capitalize"
        v-for="weather of props.forecast.weather"
        :key="weather.main"
      >
        {{ weather.description }}&nbsp;
      </span>
    </div>
    <div class="flex gap-4">
      <span class="flex items-center gap-1 text-sm">
        <img class="inline-block w-5 h-5" :src="navigationIcon" alt="Wind" />
        {{ forecast.wind.speed }}m/s {{ forecast.wind.deg }}
      </span>
      <span class="flex items-center gap-1 text-sm">
        <img class="inline-block w-5 h-5" :src="pressureIcon" alt="Wind" />
        {{ forecast.main.pressure }}hPa
      </span>
    </div>
    <div class="flex gap-4">
      <span class="flex items-center gap-1 text-sm">
        Humidity:
        {{ forecast.main.humidity }}%
      </span>
      <span class="flex items-center gap-1 text-sm">
        Dew point:
        {{
          calculateDewPoint(
            props.forecast.main.temp,
            props.forecast.main.humidity
          ).toFixed(1)
        }}°C
      </span>
    </div>
    <div class="flex gap-4">
      <span class="flex items-center gap-1 text-sm">
        Visibility:
        {{ (forecast.visibility / 1000).toFixed(1) }}km
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeatherForecast } from "@/interfaces";
import navigationIcon from "@/assets/images/navigation.svg";
import pressureIcon from "@/assets/images/pressure.svg";
import { calculateDewPoint } from "@/utils";

const props = defineProps<{
  forecast: WeatherForecast;
}>();
</script>

<style scoped></style>
