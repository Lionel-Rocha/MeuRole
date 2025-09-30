import Restaurant from "../models/restaurant.ts";
import {distance, addressCoordinates} from "../helpers/location.ts"

export async function searchAllRestaurants(address: string, radius: number){

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

    if(allRestaurants[i].type == "bar"){
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
export async function searchRestaurantsByType(address: string, radius: number, type: string){


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
