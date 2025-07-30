const pointsDb = require('../database/points');
const cinemasDb = require('../database/cinemas');
const axios = require("axios");
const geolocationUtils = require("../utils/geolocation");
const {getCinemasNearAddress} = require("./cinemas");
const geolocationUrl = "https://www.mapquestapi.com/geocoding/v1/address";

//vamos fixar o valor do ingresso para 35 reais. Ajustável.
const cinemaPrice = 35;

async function generatesOuting(address, radius, type, budget) {

    try{
        const pointsNearAddress = await getPointsNearAddress(address, radius);
        const cinemasNearAddress = await getCinemasNearAddress(address, radius);

        if (type === "part") {
            return { pointsNearAddress, cinemasNearAddress };
        }

        if (type === "whole") {
            let suggestions = [];

            // 1. cinema + ponto
            for (let cinema of cinemasNearAddress) {
                for (let point of pointsNearAddress) {
                    const totalCost = parseFloat(cinemaPrice) + parseFloat(point.price);
                    if (totalCost <= budget) {
                        suggestions.push({
                            combo: [cinema, point],
                            totalCost
                        });
                    }

                }
            }


            // 2. ponto + ponto (sem repetir)
            for (let i = 0; i < pointsNearAddress.length; i++) {
                for (let j = i + 1; j < pointsNearAddress.length; j++) {
                    const pointA = pointsNearAddress[i];
                    const pointB = pointsNearAddress[j];
                    const totalCost = parseFloat(pointA.price) + parseFloat(pointB.price);
                    if (totalCost <= budget) {
                        suggestions.push({
                            combo: [pointA, pointB],
                            totalCost
                        });
                    }
                }
            }

            return suggestions || { message: "Nenhum passeio válido encontrado dentro do orçamento." };
        }

    } catch (e) {
        throw new Error ("Houve um erro ao gerar sugestões de passeio: " + e.message);
    }

}


async function getPointsNearAddress(address, radius){
    const allPoints = await pointsDb.getAllPoints();

    let relevantPoints = [];

    let addressCoordinates = await axios.post(geolocationUrl, {
        key: process.env.MAPQUEST_KEY,
        location: address + " - Rio de Janeiro"
    });

    addressCoordinates = addressCoordinates.data.results[0].locations[0].latLng;


    for (let i = 0; i < allPoints.length; i++){
        //calculate the distance between cinema and given address
        let distance = geolocationUtils.distance(allPoints[i].latitude, allPoints[i].longitude, addressCoordinates.lat, addressCoordinates.lng)

        if (distance <= radius){
            relevantPoints.push(allPoints[i]);
        }
    }
    return relevantPoints;
}

module.exports = {
    generatesOuting
}