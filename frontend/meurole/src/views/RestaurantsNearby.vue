<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonToolbar,
  IonLoading, // IMPORTADO
  IonButtons
} from "@ionic/vue";
import router from "@/router";

const restaurants = ref<any[]>([]);
const sortedRestaurants = ref<any[]>([]);
const modal = ref();
const selectedRestaurant = ref<any>(null);
const isLoading = ref(true); // ESTADO DE LOADING

function sortByRating(items: any[]) {
  return [...items].sort((a, b) => {
    const ratingA = a.rating ?? Infinity;
    const ratingB = b.rating ?? Infinity;
    return ratingB - ratingA;
  });
}

function translateType(parsedRestaurants: any) {
  for (let i = 0; i < parsedRestaurants.length; i++) {
    if (parsedRestaurants[i].type === "brazilian") parsedRestaurants[i].type = "brasileira";
    else if (parsedRestaurants[i].type === "italian") parsedRestaurants[i].type = "italiana";
    else if (parsedRestaurants[i].type === "asian") parsedRestaurants[i].type = "asiática";
    else if (parsedRestaurants[i].type === "vegan") parsedRestaurants[i].type = "vegana";
    else if (parsedRestaurants[i].type === "other") parsedRestaurants[i].type = "outros";
    else if (parsedRestaurants[i].type === "hamburguer") parsedRestaurants[i].type = "hambúrguer";
  }
}

function openModal(restaurant: any) {
  selectedRestaurant.value = restaurant;
  modal.value.$el.present();
}

function closeModal() {
  modal.value.$el.dismiss();
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => v * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sortByDistance(items: any[]) {
  if (items.length === 0) return [];

  const base = items[0];
  if (!base?.latitude || !base?.longitude) return items;

  return [...items].sort((a, b) => {
    const distA = a.latitude && a.longitude
        ? getDistance(base.latitude, base.longitude, a.latitude, a.longitude)
        : Infinity;
    const distB = b.latitude && b.longitude
        ? getDistance(base.latitude, base.longitude, b.latitude, b.longitude)
        : Infinity;
    return distA - distB;
  });
}

function sortRestaurantsByRating() {
  sortedRestaurants.value = sortByRating(restaurants.value);
}

function sortRestaurantsByDistance() {
  sortedRestaurants.value = sortByDistance(restaurants.value);
}

onMounted(() => {
  const storedRestaurants = localStorage.getItem('restaurants');
  if (storedRestaurants) {
    const parsedRestaurants = JSON.parse(storedRestaurants);
    translateType(parsedRestaurants);
    restaurants.value = parsedRestaurants;
  }
  sortRestaurantsByDistance();
  isLoading.value = false; // FINALIZA O LOADING
});
</script>

<template>
  <ion-page>
    <!-- LOADING -->
    <ion-loading
        :is-open="isLoading"
        message="Carregando restaurantes..."
        spinner="circles"
    ></ion-loading>

    <ion-header>
      <ion-toolbar>
        <ion-button slot="start" @click="sortRestaurantsByRating">Nota</ion-button>
        <ion-button slot="end" @click="sortRestaurantsByDistance">Distância</ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container" v-if="!isLoading">
        <template v-if="sortedRestaurants.length">
          <ion-card v-for="(restaurant, index) in sortedRestaurants" :key="index">
            <ion-card-title>{{ restaurant.name }}</ion-card-title>
            <ion-card-subtitle>
              Total: {{ restaurant.rating.toFixed(1) }}
            </ion-card-subtitle>
            <ion-button @click="openModal(restaurant)">Ver mais</ion-button>
          </ion-card>
        </template>

        <div v-else class="empty-message">
          Nenhum restaurante encontrado
        </div>
      </div>

      <ion-modal ref="modal">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="closeModal">Fechar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="selectedRestaurant">
            <h2>{{ selectedRestaurant.name }}</h2>
            <p><strong>Endereço:</strong> {{ selectedRestaurant.address }}</p>
            <p><strong>Tipo:</strong> {{ selectedRestaurant.type }}</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>

    <ion-button @click="router.back()">Voltar</ion-button>
  </ion-page>
</template>

<style scoped>
ion-modal ion-content{
  --background: #F7F7F7;
}

ion-modal ion-toolbar{
  --background:  #008000;
  --color: #fff;
}

ion-modal ion-toolbar ion-button{
  --color: #fff;
}

ion-content {
  --background: url('/background.png');
  text-align: center;

  /* Remova altura fixa para não interferir no header sticky */
  /* height: 90vh; */
  height: 100%; /* ocupa toda área disponível */

  /* Flexbox pode continuar se quiser centralizar container */
  display: flex;
  justify-content: flex-start; /* para o conteúdo começar abaixo do header */
  align-items: center;
  flex-direction: column; /* para colocar cards em coluna */
  padding-top: 1em;
  padding-bottom: 1em;
  overflow-y: auto; /* permite scroll se precisar */
}

#container {
  width: 70vw;
  max-width: 500px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

ion-card {
  width: 100%;
  padding: 1em;
}

ion-card-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
  text-align: center;
}

ion-card-subtitle {
  text-align: center;
}

ion-button {
  --background: #008000;
}

</style>