<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonToolbar
} from '@ionic/vue'
import router from "@/router";

const outings = ref<any[]>([])
const sortedOutings = ref<any[]>([])
const modal = ref()
const selectedOuting = ref<any>(null)
// Função de cálculo de distância (mantida igual)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => v * Math.PI / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Funções de ordenação (modificadas para retornar o array ordenado)
function sortByPrice(items: any[]) {
  return [...items].sort((a, b) => {
    const priceA = a.totalCost ?? Infinity  // Alterado para Infinity
    const priceB = b.totalCost ?? Infinity
    return priceA - priceB
  })
}

function sortByDistance(items: any[]) {
  if (items.length === 0) return []

  const base = items[0]
  if (!base?.latitude || !base?.longitude) return items

  return [...items].sort((a, b) => {
    const distA = a.latitude && a.longitude
        ? getDistance(base.latitude, base.longitude, a.latitude, a.longitude)
        : Infinity
    const distB = b.latitude && b.longitude
        ? getDistance(base.latitude, base.longitude, b.latitude, b.longitude)
        : Infinity
    return distA - distB
  })
}

function getsOutingCoordinates(outing: any){
  return outing.address;
}

async function getsRestaurantsNearOuting(outing: any) {
  let address = getsOutingCoordinates(outing);
  let data = {address, radius: 2}

  try{
    let restaurants = await fetch("https://meurole-production.up.railway.app/restaurants", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!restaurants.ok) {
      alert('Erro ao enviar o formulário. Por favor, tente novamente.');
      return;
    }

    localStorage.setItem('restaurants', JSON.stringify(await restaurants.json()));
    await router.push('/restaurantsNearby');
    modal.value.$el.dismiss();
  } catch (err) {
    console.error(err);
    alert('Erro inesperado.');
  }


}
// Funções que atualizam sortedOutings
function sortOutingsByPrice() {
  sortedOutings.value = sortByPrice(outings.value);
}

function sortOutingsByDistance() {
  sortedOutings.value = sortByDistance(outings.value);
}

function openModal(outing: any) {
  selectedOuting.value = outing
  modal.value.$el.present()
}

function closeModal() {
  modal.value.$el.dismiss()
}
onMounted(() => {
  const stored = localStorage.getItem('outings')
  if (stored) {
    const parsed = JSON.parse(stored)

    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].combo) {
      outings.value = parsed.map((outing: any) => ({
        ...outing,
        name: `${outing.combo?.[0]?.name || ''} + ${outing.combo?.[1]?.name || ''}`,
        address: `${outing.combo?.[0]?.address || ''} e ${outing.combo?.[1]?.address || ''}`,
        totalCost: outing.totalCost,
         }))
    } else {
      outings.value = [
        ...(parsed.pointsNearAddress || []).map((p: any) => ({
          name: p.name,
          address: p.address || '',
          totalCost: Number(p.price) || 0,
          latitude: p.latitude,
          longitude: p.longitude,
        })),
        ...(parsed.cinemasNearAddress || []).map((c: any) => ({
          name: c.name,
          address: c.address || '',
          totalCost: -1,
          latitude: c.latitude,
          longitude: c.longitude,
        }))
      ]
    }

    // Ordenação inicial por preço
    sortOutingsByPrice()
  }
})

</script>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-button slot="start" @click="sortOutingsByPrice">Preço</ion-button>
        <ion-button slot="end" @click="sortOutingsByDistance">Distância</ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <template v-if="sortedOutings.length">
          <ion-card v-for="(outing, index) in sortedOutings" :key="index">
            <ion-card-title>{{ outing.name }}</ion-card-title>
            <ion-card-subtitle v-if="outing.totalCost >= 0">
              Total: {{ outing.totalCost.toFixed(2) }}
            </ion-card-subtitle>
            <ion-button @click="openModal(outing)">Ver mais</ion-button>
          </ion-card>
        </template>

        <div v-else class="empty-message">
          Nenhum passeio encontrado
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
          <div v-if="selectedOuting">
            <h2>{{ selectedOuting.name }}</h2>
            <p><strong>Endereço:</strong> {{ selectedOuting.address }}</p>
            <p v-if="selectedOuting.totalCost >= 0">
              <strong>Preço:</strong> R$ {{ selectedOuting.totalCost.toFixed(2) }}
            </p>
            <p v-else><strong>Preço:</strong> Não disponível</p>
            <p>Por que não dar uma olhada nos restaurantes próximos?</p>
            <ion-button @click="getsRestaurantsNearOuting(selectedOuting)">Clique aqui</ion-button>
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