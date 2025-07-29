const axios = require("axios");
const cinemadb = require("../database/cinemas");
const {json} = require("express");
const geolocationUtils = require('../utils/geolocation')
const geolocationUrl = "https://www.mapquestapi.com/geocoding/v1/address";

async function getCinemasNearAddress(address, radius){

    const allCinemas = await cinemadb.getAllCinemas();


    let relevantCinemas = [];

    let addressCoordinates = await axios.post(geolocationUrl, {
        key: process.env.MAPQUEST_KEY,
        location: address + " - Rio de Janeiro"
    });

    addressCoordinates = addressCoordinates.data.results[0].locations[0].latLng;


    for (let i = 0; i < allCinemas.length; i++){
        let distance = geolocationUtils.distance(allCinemas[i].latitude, allCinemas[i].longitude, addressCoordinates.lat, addressCoordinates.lng)

        if (distance <= radius){
            relevantCinemas.push(allCinemas[i]);
        }
    }
    return relevantCinemas;
}

module.exports = {
    getCinemasNearAddress
}