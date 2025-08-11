<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRange,
  IonToolbar
} from '@ionic/vue';
import router from "@/router";
import {onMounted, ref} from "vue";
import 'vue3-carousel/carousel.css';
import {Carousel, Slide} from 'vue3-carousel';

const selectedPub = ref<any>(null);
const carouselConfig = {
  itemsToShow: 1.5,
  wrapAround: true,
  autoplay: 3000
}

const pubs = ref<any[]>([]);
const filteredPubs = ref<any[]>([]);
const loading = ref(true);
const restType = ref();
const modal = ref();
const tip = ref("");
async function getPubs() {
  try {
    const res = await fetch("https://meurolecarioca.onrender.com/restaurants/pubRating");
    const data = await res.json();
    pubs.value = data;
    filteredPubs.value = data.filter((r: { rating: number }) => r.rating >= 4.6);
  } catch (err) {
    console.error("Erro ao buscar bares:", err);
  } finally {
    loading.value = false;

  }
  return filteredPubs;
}

function searchPubs() {
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
    let response = await fetch('https://meurolecarioca.onrender.com/restaurants/pubAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response) {
      alert('Erro ao enviar o formulário. Por favor, tente novamente.');
      return;
    } else if (response.status == 404){
      alert('Não foram encontrados bares no endereço e raio fornecidos.')
    }

    localStorage.setItem('pubs', JSON.stringify(await response.json()));
    await router.push('/nightlifeNearby');

  } catch (err) {
    console.error("Erro na busca:", err);
    alert('Erro ao buscar bares.');
  } finally {
    loading.value = false;
  }
}

async function selectTips() {
  try {
    const res = await fetch('/tips.json');
    let tipsArray = await res.json();
    tipsArray = tipsArray.tips;
    const randomNumber = Math.floor(Math.random() * tipsArray.length);
    console.log(tipsArray[randomNumber]);
    return tipsArray[randomNumber];
  } catch (err) {
    console.error("Erro ao carregar dicas:", err);
    return "Aproveite o seu dia!";
  }
}

function openModal(pub: any) {
  selectedPub.value = pub;
  modal.value.$el.present();
}

function closeModal() {
  modal.value.$el.dismiss();
}

onMounted(async () => {
  await getPubs();
  tip.value = await selectTips();
  console.log(tip);
  // translateType(restaurants.value);
  // filteredRestaurants.value = restaurants.value;
});

</script>

<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.back()">Voltar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Spinner de carregamento -->
      <ion-loading
          :is-open="loading"
          message="Carregando bares..."
          spinner="crescent"
      ></ion-loading>

      <!-- Conteúdo só aparece quando o loading for falso -->
      <div v-if="!loading">
        <div style="position: absolute; top: 20px; left: 0; right: 0; text-align: center;">
          <img src="/logo2.png" alt="Logo">
        </div>

        <div id="container">

          <ion-text color="dark"><h4 style="margin-top:1em">Bares por endereço</h4></ion-text>

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
            <ion-button @click="searchPubs">
              Buscar bares
            </ion-button>
          </ion-list>

          <ion-text color="dark"><h4 style="margin-top:2em">Bares recomendados</h4></ion-text>

          <Carousel v-bind="carouselConfig">
            <Slide v-for="(pub, index) in filteredPubs" :key="index">
              <ion-card>
                <ion-card-header>
                  <ion-card-subtitle>{{ pub.name }}</ion-card-subtitle>
                  <ion-card-content>Nota: {{ pub.rating }}</ion-card-content>
                  <ion-button @click="openModal(pub)">Ver mais</ion-button>
                </ion-card-header>
              </ion-card>
            </Slide>
          </Carousel>

          <br>

          <div style="max-width: 60em">
            <ion-text><h4>Dica</h4></ion-text>
            <ion-text>{{tip}}</ion-text>
          </div>


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
          </div>
        </ion-content>
      </ion-modal>


    </ion-content>

  </ion-page>
</template>


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