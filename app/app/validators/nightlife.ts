import vine from '@vinejs/vine'

const NightlifeSearchValidator = vine.compile(
    vine.object({
        address: vine.string(),
        radius: vine.string()
    })

)

export default NightlifeSearchValidator;
