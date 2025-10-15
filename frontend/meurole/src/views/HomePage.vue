<template>
  <ion-page>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="main">
        <div style="position: absolute; top: 20px; left: 0; right: 0; text-align: center;">
          <img src="/logo2.png" alt="Logo">
        </div>

        <br>

        <div id="container">
          <strong>Qual vai ser seu próximo rolé?</strong>
          <br>
          <ion-button @click="redirectToRestaurants">restaurantes</ion-button>
          <ion-button @click="redirectToNightlife">vida noturna</ion-button>
          <br>
          <p style="padding-top: 1em">OU DESCUBRA UM ROLÉ NAS PROXIMIDADES</p>

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
            <ion-item>
              <ion-checkbox id="duration" label-placement="start" justify="start">dia inteiro</ion-checkbox>
            </ion-item>
            <br>
            <ion-item>
              <ion-input id="budget" type="number" placeholder="orçamento" color="dark"></ion-input>
            </ion-item>

          </ion-list>

          <ion-button @click="handleClick">Enviar</ion-button>
        </div>
      </div>

      <ion-loading
          :is-open="loading"
          message="Carregando..."
          spinner="crescent"
      />

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonList, IonItem, IonInput, IonRange, IonCheckbox,
  IonLoading
} from '@ionic/vue';
import { ref } from 'vue';
import router from "@/router";

const loading = ref(false); // controla o spinner

function redirectToRestaurants(){
  router.push('/restaurants');
}

function redirectToNightlife(){
  router.push('/nightlife');
}

function handleClick() {
  const address = (document.getElementById('address') as HTMLInputElement).value;
  const radius = (document.getElementById('radius') as HTMLInputElement).value;
  const duration = (document.getElementById('duration') as HTMLInputElement).checked;
  let budget = (document.getElementById('budget') as HTMLInputElement).value;

  let durationText = duration ? 'whole' : 'part';

  if (address && radius && budget) {
    let radiusNum = parseInt(radius);
    let budgetNum = parseFloat(budget);
    sendForm(address, radiusNum, durationText, budgetNum);
  } else {
    alert('Por favor, preencha todos os campos obrigatórios.');
  }
}

async function sendForm(address:string, radius:number, duration:string, budget:number){
  loading.value = true; // ativa loading

  try {
    const data = { address, radius, type: duration, budget };

    let response = await fetch('https://meurole-production.up.railway.app/outings', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      alert('Erro ao enviar o formulário. Por favor, tente novamente.');
      return;
    }

    localStorage.setItem('outings', JSON.stringify(await response.json()));
    await router.push('/outings');

  } catch (err) {
    console.error(err);
    alert('Erro inesperado.');
  } finally {
    loading.value = false; // desativa loading
  }
}
</script>

<style scoped>

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
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
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
