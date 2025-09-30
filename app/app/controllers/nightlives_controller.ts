import type { HttpContext } from '@adonisjs/core/http'
import RestaurantSearchValidator from "#validators/restaurant";
import {searchAllNightlife} from "#services/nightlives";

export default class NightlivesController {

    async searchAll({ request, response }: HttpContextContract){
        try {
            const payload = await request.validateUsing(RestaurantSearchValidator)

            const result = await searchAllNightlife(payload.address, payload.radius);

            return response.ok(result)
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.unprocessableEntity({
                    message: 'Erro de validação',
                    errors: error.messages,
                })
            }

            throw error
        }
    }

}
