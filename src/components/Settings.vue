<template>
  <div class="flex flex-col gap-2">
    <div>
      <div
        class="drop-zone"
        v-for="(city, index) of cities"
        :key="city.name"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div
          class="flex justify-between px-4 py-2 text-sm font-medium text-gray-700 rounded-lg focus:bg-gray-50 hover:bg-gray-50"
          draggable="true"
          @dragstart="startDrag($event, index)"
        >
          <div class="flex items-center hover:cursor-move focus:outline-none">
            <button
              class="w-10 inline-block p-1 bg-inherit border-none outline-none hover:cursor-move focus:outline-none"
            >
              <img alt="Move" :src="hamburgerIcon" draggable="false" />
            </button>
            <span class="pl-2 select-none">{{ city.name }}</span>
          </div>
          <button
            class="w-8 px-2 inline-block p-1 bg-inherit border-none rounded hover:cursor-pointer focus:outline-none focus:ring hover:bg-rose-100"
            @click="deleteCity(index)"
          >
            <img alt="Delete" :src="trashIcon" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <span class="font-medium">Add location</span>
      <div class="flex gap-2 w-full">
        <input
          class="w-full p-3 text-sm border-2 border-gray-200 rounded-md"
          name="location"
          id="location"
          type="text"
          :value="form.search"
          @input="(event) => findCities(services.api, (event.target as HTMLInputElement).value)"
          @keydown.enter="findCities(services.api, form.search)"
        />
        <button
          :disabled="!canAddCity"
          class="inline-flex justify-center items-center px-4 border-none rounded-md bg-lime-100 disabled:bg-transparent disabled:hover:cursor-not-allowed hover:cursor-pointer focus:outline-none focus:ring"
          @click="addCity(form.dictionary[0])"
        >
          <img alt="Submit" :src="enterIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import hamburgerIcon from "@/assets/images/hamburger.svg";
import trashIcon from "@/assets/images/trash.svg";
import enterIcon from "@/assets/images/enter.svg";
import { City } from "@/interfaces";
import apiService from "@/services/api.service";

interface Props {
  cities: City[];
}

interface Form {
  search: string;
  dictionary: City[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "updateCities", cities: City[]): void;
}>();

const services = {
  api: apiService,
};
const form = ref<Form>({
  search: "",
  dictionary: [],
});
const loading = ref({
  cities: false,
});

const canAddCity = computed(
  () => !loading.value.cities && form.value.search && form.value.dictionary[0]
);

function changeForm(payload: Partial<Form>) {
  form.value = {
    ...form.value,
    ...payload,
  };
}

async function findCities(service: typeof apiService, search: string) {
  changeForm({
    search,
    dictionary: [],
  });
  if (!search) {
    return;
  }
  loading.value.cities = true;
  const cities = await service.getCity(search);
  changeForm({
    search,
    dictionary: cities,
  });
  loading.value.cities = false;
}

function addCity(city: City) {
  emit("updateCities", [...props.cities, city]);
  form.value = {
    search: "",
    dictionary: [],
  };
}

function deleteCity(index: number) {
  emit(
    "updateCities",
    props.cities.filter((_, i) => i !== index)
  );
}

function startDrag(event: DragEvent, index: number) {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", String(index));
  }
}

function onDrop(event: DragEvent, index: number) {
  if (event.dataTransfer) {
    const draggedCityIndex = +event.dataTransfer.getData("text/plain");
    const draggedCity = { ...props.cities[draggedCityIndex] };
    const city = { ...props.cities[index] };
    const cities = props.cities.map((c, i) => {
      if (i === index) {
        return draggedCity;
      } else if (i === draggedCityIndex) {
        return city;
      }
      return c;
    });
    emit("updateCities", cities);
  }
}
</script>

<style scoped></style>
