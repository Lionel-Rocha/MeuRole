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

const pubs = ref<any[]>([]);
const sortedPubs = ref<any[]>([]);
const modal = ref();
const selectedPub = ref<any>(null);
const isLoading = ref(true); // ESTADO DE LOADING

function sortByRating(items: any[]) {
  return [...items].sort((a, b) => {
    const ratingA = a.rating ?? Infinity;
    const ratingB = b.rating ?? Infinity;
    return ratingB - ratingA;
  });
}

function sortPubsByDistance() {
  sortedPubs.value = sortByDistance(pubs.value);
}
function openModal(pub: any) {
  selectedPub.value = pub;
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
  sortedPubs.value = sortByRating(pubs.value);
}

function sortRestaurantsByDistance() {
  sortedPubs.value = sortByDistance(pubs.value);
}

onMounted(() => {
  const storedPubs = localStorage.getItem('pubs');
  if (storedPubs) {
    const parsedPubs = JSON.parse(storedPubs);
    pubs.value = parsedPubs;
  }
  sortPubsByDistance();
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
        <template v-if="sortedPubs.length">
          <ion-card v-for="(pub, index) in sortedPubs" :key="index">
            <ion-card-title>{{ pub.name }}</ion-card-title>
            <ion-card-subtitle>
              Total: {{ pub.rating.toFixed(1) }}
            </ion-card-subtitle>
            <ion-button @click="openModal(pub)">Ver mais</ion-button>
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
          <div v-if="selectedPub">
            <h2>{{ selectedPub.name }}</h2>
            <p><strong>Endereço:</strong> {{ selectedPub.address }}</p>
            <p><strong>Tipo:</strong> {{ selectedPub.type }}</p>
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
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-top: 1em;
  padding-bottom: 1em;
  overflow-y: auto;
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