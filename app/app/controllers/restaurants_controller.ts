
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RestaurantSearchValidator from '../validators/restaurant.js'
import {getRestaurantById, searchAllRestaurants, searchRestaurantsByType} from '../services/restaurants.js'
import Restaurant from "#models/restaurant";

export default class RestaurantsController {
   async searchAll({ request, response }: HttpContextContract) {

     try {
      const payload = await request.validateUsing(RestaurantSearchValidator)

      const result = await searchAllRestaurants(payload.address, payload.radius);

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

  async searchType({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validateUsing(RestaurantSearchValidator)

      const result = await searchRestaurantsByType(
        payload.address,
        payload.radius,
        payload.type
      )

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

  async searchRestaurantById({ request, response, params }: HttpContextContract) {
       const restaurant = await getRestaurantById(params.id);
       return response.ok(restaurant);
  }
}
