
const express = require('express');
const router = express.Router();
const outingscore = require('../core/outings');

router.post('/', async (req, res) => {
    const {address, radius, type, budget} = req.body;
    let outingOptions = await outingscore.generatesOuting(address, radius, type, budget);
    res.status(200).send(outingOptions);
});

module.exports = router;