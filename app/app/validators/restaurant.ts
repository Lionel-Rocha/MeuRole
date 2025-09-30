import vine from '@vinejs/vine'

const RestaurantValidator = vine.object(
 {
    name: vine.string(),
    address: vine.string(),
    type: vine.enum(["other","brazilian","vegan","italian","asian","pizza","hamburguer"]),
    rating: vine.number()
  }
)

const RestaurantSearchValidator = vine.compile(
  vine.object({
    address: vine.string(),
    radius: vine.number(),
    type: vine.enum(["other","brazilian","vegan","italian","asian","pizza","hamburguer"]).optional().nullable()
    })
)

export const RestaurantCreationValidator = vine.compile(RestaurantValidator.clone())

export default RestaurantSearchValidator;
