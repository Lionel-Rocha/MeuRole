import env from '#start/env'
export function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Earth's radius
    const R = 6371;

    // Conversion
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    // Distance in km
    return R * c;
}

export async function addressCoordinates(address: string){
    const key = env.get('MAPQUEST_KEY')
    let result = await fetch(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${address}`,
        {
            method: "GET"
        }
    )
    result = await result.json();

    result = result['results'][0]['locations']


    if (!result){
        throw new Error("puts, deu ruim aqui no /helpers/addressCoordinates") //pelo amor de deus eu preciso mudar isso
    }

    let lat_lng = result[0]['latLng']
    return [lat_lng['lat'], lat_lng['lng']]

}

