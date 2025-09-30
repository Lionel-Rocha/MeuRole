import vine from '@vinejs/vine'

const OutingValidator = vine.object({
    name: vine.string(),
    duration: vine.enum(["part", "whole"]),
    address: vine.string(),
    price: vine.number(),
    rating: vine.number()
});

export const OutingSearchValidator = vine.compile(
    vine.object({
        address: vine.string(),
        radius: vine.number(),
        duration: vine.enum(["part", "whole"]),
        budget: vine.number()
    })
)

export const OutingCreationValidator = vine.compile(OutingValidator.clone())
