const pointsDb = require('../database/points');
const cinemasDb = require('../database/cinemas');
const axios = require("axios");
const geolocationUtils = require("../utils/geolocation");
const {getCinemasNearAddress} = require("./cinemas");
const geolocationUrl = "https://www.mapquestapi.com/geocoding/v1/address";

//vamos fixar o valor do ingresso
const cinemaPrice = 35;

async function generatesOuting(address, radius, type, budget) {
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

        // ❌ não adicionamos 2 cinemas em nenhum momento

        suggestions.sort((a, b) => {
            const [p1a, p2a] = a.combo;
            const [p1b, p2b] = b.combo;

            const distA = geolocationUtils.distance(p1a, p2a);
            const distB = geolocationUtils.distance(p1b, p2b);

            if (distA !== distB) {
                return distA - distB; // menor distância primeiro
            }

            if (a.totalCost !== b.totalCost) {
                return a.totalCost - b.totalCost; // menor custo depois
            }

            const ratingA = (p1a.rating || 0) + (p2a.rating || 0);
            const ratingB = (p1b.rating || 0) + (p2b.rating || 0);

            return ratingB - ratingA; // maior rating por último
        });






        return suggestions || { message: "Nenhum passeio válido encontrado dentro do orçamento." };
    }

    return { error: "Tipo inválido. Use 'part' ou 'whole'." };
}


async function getPointsNearAddress(address, radius){
    const allPoints = await pointsDb.getAllPoints();

    let relevantPoints = [];

    let addressCoordinates = await axios.post(geolocationUrl, {
        key: process.env.MAPQUEST_KEY,
        location: address
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