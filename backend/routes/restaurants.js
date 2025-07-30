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

module.exports = router;