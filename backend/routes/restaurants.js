const express = require('express');
const router = express.Router();
const restaurantsCore = require('../core/restaurants');

router.post('/', async (req, res) => {
    const {address, radius} = req.body;
    let outingOptions = await restaurantsCore.getRestaurantsNearAddress(address, radius);
    res.status(200).send(outingOptions);
});

module.exports = router;