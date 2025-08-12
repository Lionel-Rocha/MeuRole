
const express = require('express');
const router = express.Router();
const outingscore = require('../core/outings');

router.post('/', async (req, res) => {
    const {address, radius, type, budget} = req.body;

    if (!address || !radius || !type || budget === null || budget === undefined) {
        return res.status(400).send({message: "Endereço, raio, tipo e orçamento são obrigatórios."});
    }

    try{
        let outingOptions = await outingscore.generatesOuting(address, radius, type, budget);
        res.status(200).send(outingOptions);
    }catch (e) {
        res.status(500).send({message: e.message});
    }


});

module.exports = router;