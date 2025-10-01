// import type { HttpContext } from '@adonisjs/core/http'

import {HttpContext} from "@adonisjs/core/http";
import {OutingSearchValidator} from "#validators/outing";
import {searchAllOutings} from "#services/outings";


export default class OutingsController {

  async searchAll({request, response}: HttpContext){
    try{
      const payload = await request.validateUsing(OutingSearchValidator)

      const result = await searchAllOutings(payload.address, payload.radius, payload.duration, payload.budget);

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
