import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import Outings from "../views/Outings.vue";
import Restaurants from "../views/Restaurants.vue";
import RestaurantsNearby from "../views/RestaurantsNearby.vue";
import RestaurantsType from "../views/RestaurantsType.vue";

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
  },
  {
    path:'/restaurantsNearby',
    name:'Restaurants Nearby',
    component: RestaurantsNearby
  },
  {
    path:"/restaurantsType/:type",
    name:"Restaurants Type",
    component: RestaurantsType
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
