
import {RestaurantSearchValidator} from "../validators/restaurant.ts";
import {HttpContext} from "@adonisjs/core/http";
import {searchRestaurants} from "#services/restaurants";

export default class RestaurantsController {

    async search({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(RestaurantSearchValidator)

            const result = await searchRestaurants(
                payload.address,
                payload.radius,
                payload.type
            )

            return response.status(200).json(result)
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.status(422).json({
                    message: "Erro de validação",
                    errors: error.messages
                })
            }

            throw error
        }
    }


}
