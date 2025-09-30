import router from '@adonisjs/core/services/router'
import NightlivesController from "#controllers/nightlives_controller";
const RestaurantsController = () => import("../app/controllers/restaurants_controller.ts");

//restaurants: type, all

router.group(() => {
  router.post('/', [RestaurantsController, 'searchAll'])
  router.post('/type', [RestaurantsController, 'searchType'])
}).prefix('/restaurants')

router.post("/nightlife", [NightlivesController, 'searchAll'])



