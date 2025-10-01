import Outing from "#models/outing"
import Cinema from "#models/cinema";
import {addressCoordinates, distance} from "../helpers/location.js";

export async function searchAllOutings(address: string, radius: number, duration: string, budget: number){
  const allOutings = await Outing
    .all()

  const allCinemas = await Cinema.all()

  const allOptions = [
    ...allOutings.map(o => o.toJSON()),
    ...allCinemas.map(c => c.toJSON()),
  ]

  const lat_lon = await addressCoordinates(address);
  let lat = lat_lon[0];
  let lon = lat_lon[1];

  let response = [];

  for (let i = 0; i < allOptions.length; i++){

    if (duration == "part" && allOptions[i].duration == "whole"){
      continue;
    }

    //clarificação: se não for um cinema e o preço do ingresso for maior que o orçamento
    if (!allOptions[i].site_url && allOptions[i].price > budget){
        continue;
      }

    let distanceKm = distance(lat, lon, allOptions[i].latitude, allOptions[i].longitude);

    if (distanceKm > radius){
      continue;
    }

    let pointOfInterest = {
      name: allOptions[i].name,
      address: allOptions[i].address,
      price: allOptions[i].price || 40,
      distance: distanceKm
    }
    response.push(pointOfInterest);
  }

  return response.sort((a, b) => a.distance - b.distance);


}
