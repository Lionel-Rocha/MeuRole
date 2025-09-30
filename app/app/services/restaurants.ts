import Restaurant from "../models/restaurant.ts";
import {distance, addressCoordinates} from "../helpers/location.ts"

/*
* 1. pega todos os restaurantes
* 2. busca os que estão no raio do endereço
* 3. verifica o tipo
* */


export async function searchRestaurants(address: string, radius: number, type: string){


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
    if (allRestaurants[i].type != type){
      continue
    }

    response.push(allRestaurants[i]);


  }

  return response;

}
