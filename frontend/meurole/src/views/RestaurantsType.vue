<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonLoading,
  IonModal,
  IonText
} from "@ionic/vue";

const route = useRoute();
const rawType = route.params.type ?? ""; // pode vir da rota
const type = Array.isArray(rawType) ? rawType[0] : rawType as string;

const restaurants = ref<any[]>([]);
const isLoading = ref(true);
const modalRef = ref<any>(null);
const selectedRestaurant = ref<any | null>(null);
const sortMode = ref<'rating' | 'none'>('rating'); // padrão por nota

// traduz tipos (opcional, para exibir no título)
function translateTypeLabel(t: string) {
  switch (t) {
    case 'brazilian': return 'BRASILEIRA';
    case 'italian': return 'ITALIANA';
    case 'asian': return 'ASIÁTICA';
    case 'vegan': return 'VEGANA';
    case 'hamburguer': return 'HAMBÚRGUER';
    case 'other': return 'OUTROS';
    case 'pizza': return 'PIZZA';
    default: return t || 'categoria';
  }
}

// fetch dos restaurantes por tipo
async function getRestaurantsByType() {
  isLoading.value = true;
  try {
    const res = await fetch("https://meurole-production.up.railway.app/restaurants/type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    restaurants.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao buscar restaurantes por tipo:", err);
    restaurants.value = [];
  } finally {
    isLoading.value = false;
  }
}

// ordenação por nota (maior para menor)
function sortByRating(items: any[]) {
  return [...items].sort((a, b) => {
    const ra = typeof a.rating === 'number' ? a.rating : -Infinity;
    const rb = typeof b.rating === 'number' ? b.rating : -Infinity;
    return rb - ra;
  });
}

const displayedRestaurants = computed(() => {
  if (!restaurants.value) return [];
  if (sortMode.value === 'rating') return sortByRating(restaurants.value);
  return [...restaurants.value];
});

function openModal(rest: any) {
  selectedRestaurant.value = rest;
  const el = modalRef.value;
  if (!el) return;
  (el.present ? el.present() : (el.$el && el.$el.present ? el.$el.present() : null));
}

function closeModal() {
  const el = modalRef.value;
  if (!el) return;
  (el.dismiss ? el.dismiss() : (el.$el && el.$el.dismiss ? el.$el.dismiss() : null));
  selectedRestaurant.value = null;
}

onMounted(() => {
  getRestaurantsByType();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.back()">Voltar</ion-button>
        </ion-buttons>



        <ion-buttons slot="end">
          <ion-button @click="sortMode = (sortMode === 'rating' ? 'none' : 'rating')">
            {{ sortMode === 'rating' ? 'Nota' : 'Nota' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Loading -->
      <ion-loading :is-open="isLoading" message="Carregando restaurantes..." spinner="crescent" />

      <!-- Conteúdo -->
      <div v-if="!isLoading" id="container">
        <template v-if="displayedRestaurants.length">
          <ion-text style="font-weight:700; margin-left:12px; font-size:1.05rem;">
            {{ translateTypeLabel(type) }}
          </ion-text>

          <ion-card v-for="(rest, idx) in displayedRestaurants" :key="rest.id ?? idx" class="restaurant-card">
            <ion-card-header>
              <ion-card-title>{{ rest.name }}</ion-card-title>
              <ion-card-subtitle v-if="rest.rating != null">Nota: {{ (rest.rating).toFixed(1) }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="card-row">
                <div class="card-info">
                  <div v-if="rest.address"><strong>Endereço:</strong> {{ rest.address }}</div>
                </div>

              </div>
            </ion-card-content>
          </ion-card>
        </template>

        <div v-else class="empty-message">

        </div>
      </div>

      <!-- Modal -->
      <ion-modal ref="modalRef">
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
            <p v-if="selectedRestaurant.rating"><strong>Nota:</strong> {{ selectedRestaurant.rating.toFixed(1) }}</p>
            <p v-if="selectedRestaurant.address"><strong>Endereço:</strong> {{ selectedRestaurant.address }}</p>
            <p v-if="selectedRestaurant.type"><strong>Tipo:</strong> {{ translateTypeLabel(selectedRestaurant.type) }}</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped>
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
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.restaurant-card {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.card-info {
  text-align: left;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-message {
  color: #666;
  margin-top: 2rem;
}
</style>
