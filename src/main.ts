import { defineCustomElement } from "vue";
import "./assets/styles/main.css";
import App from "./App.ce.vue";

const widget = defineCustomElement(App);
customElements.define("weather-widget", widget);
