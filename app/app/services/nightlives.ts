import Restaurant from "#models/restaurant";
import {addressCoordinates, distance} from "../helpers/location.js";

export async function searchAllNightlife(address: string, radius: number){

    const allRestaurants = await Restaurant.all();
    const lat_lon = await addressCoordinates(address);
    let lat = lat_lon[0];
    let lon = lat_lon[1];

    let response = [];

    for (let i = 0; i < allRestaurants.length; i++){
        let distanceKm = distance(lat, lon, allRestaurants[i].latitude, allRestaurants[i].longitude)
        if (distanceKm > radius){
            continue
        }

        if(allRestaurants[i].type != "bar"){
            continue;
        }
        let restaurant = {
            name: allRestaurants[i].name,
            address: allRestaurants[i].address,
            type: allRestaurants[i].type,
            rating: allRestaurants[i].rating,
            distance: distanceKm
        }
        response.push(restaurant);


    }

    return response;

}
