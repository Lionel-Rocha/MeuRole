/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const RestaurantsController = () => import("../app/controllers/restaurants_controller.ts");

router.post('/', [RestaurantsController, "search"])
