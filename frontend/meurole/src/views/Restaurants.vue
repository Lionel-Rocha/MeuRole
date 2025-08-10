<template>
  <ion-page>

    <ion-content :fullscreen="true">
      <!-- Spinner de carregamento -->
      <ion-loading
          :is-open="loading"
          message="Carregando restaurantes..."
          spinner="crescent"
      ></ion-loading>

      <!-- Conteúdo só aparece quando o loading for falso -->
      <div v-if="!loading">
        <div style="position: absolute; top: 20px; left: 0; right: 0; text-align: center;">
          <img src="/logo2.png" alt="Logo">
        </div>

        <div id="container">

          <ion-text color="dark"><h1>Restaurantes por categoria</h1></ion-text>

          <ion-button @click="redirect('brazilian')"><img src="/brazilian.png" alt="comida brasileira"/></ion-button>
          <ion-button @click="redirect('vegan')"><img src="/vegan.png" alt="comida vegana"/></ion-button>
          <ion-button @click="redirect('asian')"><img src="/asian.png" alt="comida asiática"/></ion-button>
          <ion-button @click="redirect('italian')"><img src="/italian.png" alt="comida italiana"/></ion-button>

          <br>

          <ion-button @click="redirect('pizza')"><img src="/pizza.png" alt="pizza"/></ion-button>
          <ion-button @click="redirect('hamburguer')"><img src="/hamburguer.png" alt="hambúrguer"/></ion-button>
          <ion-button @click="redirect('other')"><img src="/other.png" alt="outras categorias"/></ion-button>



          <ion-text color="dark"><h4 style="margin-top:1em">Restaurantes por endereço</h4></ion-text>

          <ion-list :inset="true">
            <ion-item>
              <ion-input id="address" placeholder="bairro/endereço" :clear-input="true" color="dark"></ion-input>
            </ion-item>
            <ion-item>
              <ion-range
                  aria-label="raio em km"
                  label="raio em km"
                  :min="1"
                  :max="10"
                  :value="5"
                  :pin="true"
                  :ticks="true"
                  :snaps="true"
                  id="radius"
              ></ion-range>
            </ion-item>

            <br>
            <ion-button @click="searchRestaurants">
              Buscar restaurantes
            </ion-button>
          </ion-list>

          <ion-text color="dark"><h4 style="margin-top:2em">Restaurantes recomendados</h4></ion-text>

          <Carousel v-bind="carouselConfig">
            <Slide v-for="(rest, index) in filteredRestaurants" :key="index">
              <ion-card>
                <ion-card-header>
                  <ion-card-subtitle>{{ rest.name }}</ion-card-subtitle>
                  <ion-card-content>Nota: {{ rest.rating }}</ion-card-content>
                </ion-card-header>
              </ion-card>
            </Slide>
          </Carousel>

        </div>
      </div>
    </ion-content>

    <ion-button @click="router.back()">Voltar</ion-button>

  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonList, IonItem, IonInput, IonRange, IonCheckbox, IonLoading
} from '@ionic/vue';
import router from "@/router";
import {onMounted, ref} from "vue";
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

const carouselConfig = {
  itemsToShow: 2.5,
  wrapAround: true,
  autoplay: 3000
}

const restaurants = ref<any[]>([]);
const filteredRestaurants = ref<any[]>([]);
const loading = ref(true);
const restType = ref();
async function getRestaurants() {
  try {
    const res = await fetch("https://meurolecarioca.onrender.com/restaurants/rating");
    const data = await res.json();
    restaurants.value = data;
    filteredRestaurants.value = data.filter((r: { rating: number }) => r.rating >= 4.6);
  } catch (err) {
    console.error("Erro ao buscar restaurantes:", err);
  } finally {
    loading.value = false;
  }
}

function searchRestaurants() {
  const address = (document.getElementById('address') as HTMLInputElement).value;
  const radius = (document.getElementById('radius') as HTMLInputElement).value;

  if (address && radius) {
    let radiusNum = parseInt(radius);

    // Mostra o loading enquanto busca
    loading.value = true;

    sendForm(address, radiusNum);
  }
}

async function sendForm(address:string, radius:number){
  const data = {
    address: address, radius: radius
  }
  try {
    let response = await fetch('https://meurolecarioca.onrender.com/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      alert('Erro ao enviar o formulário. Por favor, tente novamente.');
      return;
    }

    localStorage.setItem('restaurants', JSON.stringify(await response.json()));
    await router.push('/restaurantsNearby');

  } catch (err) {
    console.error("Erro na busca:", err);
    alert('Erro ao buscar restaurantes.');
  } finally {
    // Sempre esconde o loading no final
    loading.value = false;
  }
}

async function redirect(value:string){
  restType.value = value;
  await router.push(`/restaurantsType/${restType.value}`);
  location.reload(); //gambiarra descarada
}

onMounted(() => {
  getRestaurants();
});
</script>



<style scoped>

ion-card{
    width: 100%;
    padding: 0.5em;
  height: 10em;
}

ion-content{
  --background: #efefef;
}


ion-checkbox{
  --checkbox-background-checked: #008000;
}

ion-checkbox::part(container){
  border: 2px solid #008000;
}

ion-button{
  --background: #008000;
}

ion-range::part(tick) {
  background: rgba(55, 255, 0, 0.2);
}

ion-range::part(tick-active) {
  background: rgba(55, 255, 0, 0.2);
}

ion-range::part(pin) {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #008000;
  color: #fff;

  border-radius: 50%;
  transform: scale(1.01);

  top: -20px;

  min-width: 28px;
  height: 28px;
  transition: transform 120ms ease, background 120ms ease;
}

ion-range::part(pin)::before {
  content: none;
}

ion-range::part(knob) {
  background: #008000;
}

ion-range::part(bar) {
  background: rgba(55, 255, 0, 0.2);
}

ion-range::part(bar-active) {
  background: rgba(55, 255, 0, 0.2);
}

#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;


}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container h1{
  color: #2f2f2f;
  text-shadow: 1px 1px 2px #757575;
}

#container h4{
  color: #2f2f2f;
  text-shadow: 1px 1px 2px #757575;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>