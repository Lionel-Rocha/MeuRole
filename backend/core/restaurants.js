const axios = require("axios");
const restaurantsdb = require("../database/restaurants");
const geolocationUtils = require('../utils/geolocation')
const geolocationUrl = "https://www.mapquestapi.com/geocoding/v1/address";

async function getRestaurantsNearAddress(address, radius){

    try{
        const allRestaurants = await restaurantsdb.getAllRestaurants();


        let relevantRestaurants = [];

        let addressCoordinates = await axios.post(geolocationUrl, {
            key: process.env.MAPQUEST_KEY,
            location: address + " - Rio de Janeiro"
        });

        addressCoordinates = addressCoordinates.data.results[0].locations[0].latLng;


        for (let i = 0; i < allRestaurants.length; i++){
            let distance = geolocationUtils.distance(allRestaurants[i].latitude, allRestaurants[i].longitude, addressCoordinates.lat, addressCoordinates.lng)

            if (distance <= radius){
                relevantRestaurants.push(allRestaurants[i]);
            }
        }
        return relevantRestaurants;
    } catch (e){
        throw new Error("Houve um erro ao buscar restaurantes próximos: " + e.message);
    }


}

async function getRated(){
    try{
        const allRestaurants = await restaurantsdb.getAllRestaurants()
        let sortedRestaurants = allRestaurants.sort((a,b) =>  b.rating - a.rating );
        return sortedRestaurants;
    } catch (e){
        throw new Error ("Houve um erro ao buscar os restaurantes por nota: " + e);
    }
}

async function getByType(type){
    try{
        return await restaurantsdb.getByType(type);
    } catch (e){
        throw new Error ("Houve um erro ao buscar os restaurantes por tipo: " + e);
    }
}

async function getBarsByRating(){
    try{
        const result = await restaurantsdb.getByType('bar');
        console.log(result);
        let barsByRating = result.sort((a,b) => b.rating - a.rating);
        console.log(barsByRating);
        return barsByRating || {} ;
    } catch (e){
        throw new Error ('Houve um erro ao retornar os bares por nota: '+ e);
    }
}

async function getBarsByAddress(address, radius){
    try{
        const allBars = await restaurantsdb.getByType('bar');
        let relevantBars = [];
        let addressCoordinates = await axios.post(geolocationUrl, {
            key: process.env.MAPQUEST_KEY,
            location: address + " - Rio de Janeiro"
        });

        addressCoordinates = addressCoordinates.data.results[0].locations[0].latLng;


        for (let i = 0; i < allBars.length; i++){
            let distance = geolocationUtils.distance(allBars[i].latitude, allBars[i].longitude, addressCoordinates.lat, addressCoordinates.lng)

            if (distance <= radius){
                relevantBars.push(allBars[i]);
            }
        }
        return relevantBars;
    } catch (e) {
        throw new Error("Houve um erro ao buscar os bares por endereço: " + e);
    }
}

module.exports = {
    getRestaurantsNearAddress,
    getRated,
    getByType,
    getBarsByRating,
    getBarsByAddress
}