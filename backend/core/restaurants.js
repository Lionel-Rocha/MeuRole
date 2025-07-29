const axios = require("axios");
const restaurantsdb = require("../database/restaurants");
const {json} = require("express");
const geolocationUtils = require('../utils/geolocation')
const geolocationUrl = "https://www.mapquestapi.com/geocoding/v1/address";

async function getRestaurantsNearAddress(address, radius){

    const allRestaurants = await restaurantsdb.getAllRestaurants();


    let relevantRestaurants = [];

    let addressCoordinates = await axios.post(geolocationUrl, {
        key: process.env.MAPQUEST_KEY,
        location: address
    });

    addressCoordinates = addressCoordinates.data.results[0].locations[0].latLng;


    for (let i = 0; i < allRestaurants.length; i++){
        let distance = geolocationUtils.distance(allRestaurants[i].latitude, allRestaurants[i].longitude, addressCoordinates.lat, addressCoordinates.lng)

        if (distance <= radius){
            relevantRestaurants.push(allRestaurants[i]);
        }
    }
    return relevantRestaurants;
}

module.exports = {
    getRestaurantsNearAddress
}