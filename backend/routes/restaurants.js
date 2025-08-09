const express = require('express');
const router = express.Router();
const restaurantsCore = require('../core/restaurants');

router.post('/', async (req, res) => {
    const {address, radius} = req.body;

    if (!address || !radius) {
        return res.status(400).send({message: "Endereço e raio são obrigatórios"});
    }

    try{
        let restaurantOptions = await restaurantsCore.getRestaurantsNearAddress(address, radius);
        res.status(200).send(restaurantOptions);
    } catch (e){
        res.status(500).send({message: e.message});
    }
});

router.get('/rating', async (req, res) => {
   try {
       let sortedRestaurants = await restaurantsCore.getRated();
       res.status(200).send(sortedRestaurants);
   } catch (e){
       res.status(500).send({message: e.message})
   }
});

router.post('/type', async (req,res) => {
    const {type} = req.body;
    if (!type){
        res.status(400).send("Tipo é obrigatório");
    }

    try{
        let restaurantsByType = await restaurantsCore.getByType(type);
        res.status(200).send(restaurantsByType);
    } catch (e){
        res.status(500).send({message: e.message});
    }
});

router.get('/pubRating', async (req, res) => {

    try {
        let pubs = await restaurantsCore.getBarsByRating();
        if (!pubs || pubs.length === 0) {
            return res.status(404).send({ message: "No bars found" });
        }
        res.status(200).send(pubs);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.post('/pubAddress', async (req, res) => {
    const { address, radius } = req.body;

    if (!address || !radius) {
        return res.status(400).send({ message: "Address and radius are required" });
    }

    try {
        let pubs = await restaurantsCore.getBarsByAddress(address, radius);
        if (!pubs || pubs.length === 0) {
            return res.status(404).send({ message: "No bars found near the given address" });
        }
        res.status(200).send(pubs);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});


module.exports = router;