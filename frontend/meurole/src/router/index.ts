import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import Outings from "../views/Outings.vue";
import Restaurants from "../views/Restaurants.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {path:'/outings',
  name: 'Outings',
  component: Outings
  },
  {
    path:'/restaurants',
    name:'Restaurants',
    component: Restaurants
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
