import router from '@adonisjs/core/services/router'
const NightlivesController = () => import("../app/controllers/nightlives_controller.ts");
const OutingsController = () => import("../app/controllers/outings_controller.ts");
const RestaurantsController = () => import("../app/controllers/restaurants_controller.ts");


router.group(() => {
  router.post('/', [RestaurantsController, 'searchAll'])
  router.post('/type', [RestaurantsController, 'searchType'])
}).prefix('/restaurants')

router.post("/nightlife", [NightlivesController, 'searchAll'])

router.post("/outings", [OutingsController, 'searchAll'])

router.get("/restaurant/:id", [RestaurantsController, 'searchRestaurantById'])


