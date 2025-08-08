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
          <ion-button>surpreenda-me</ion-button>
          <br>
          <p>OU</p>

          <ion-list :inset="true">
            <ion-item>
              <ion-input id="address" label="bairro ou endereço" :clear-input="true" color="dark"></ion-input>
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
              <ion-input id="budget" type="number" label="orçamento" color="dark"></ion-input>
            </ion-item>

          </ion-list>

          <ion-button @click="handleClick">Enviar</ion-button>
        </div>
      </div>



    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import router from "@/router";

function handleClick() {
  const address = (document.getElementById('address') as HTMLInputElement).value;
  const radius = (document.getElementById('radius') as HTMLInputElement).value;
  const duration = (document.getElementById('duration') as HTMLInputElement).checked;
  const budget = (document.getElementById('budget') as HTMLInputElement).value;

  let durationText = duration ? 'whole' : 'part';

  console.log(`Address: ${address}, Radius: ${radius}, Duration: ${duration}, Budget: ${budget}`);

  if (address && radius && budget) {
    sendForm(address, radius, durationText, budget);
  } else {
    alert('Por favor, preencha todos os campos obrigatórios.');
  }

}

async function sendForm(address, radius, duration, budget){
  const data = {
    address: address, radius: radius, type: duration, budget: budget
  }

  let response = await fetch('https://meurolecarioca.onrender.com/outings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    //PLACEHOLDER
    alert('Erro ao enviar o formulário. Por favor, tente novamente.');
    return;
  }
  localStorage.setItem('outings', JSON.stringify(await response.json()));
  await router.push('/outings');
}

//Sei que não é exatamente certo, mas vou deixar aqui a responsabilidade.
async function keepAlive(){
  await fetch('https://meurolecarioca.onrender.com/outings')
      .then(response => console.log('Keep alive ping sent'))
      .catch(error => console.error('Error in keep alive ping:', error));
}

setTimeout(keepAlive, 5 * 60 * 1000); // 5 minutes

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
