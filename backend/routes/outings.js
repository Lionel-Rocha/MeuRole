//askOuting
//POST: /outing/
//recebe: address, radius, duration

//NOTAS:
//cinema é part
//part + part = whole
//budget precisa ser considerado

const express = require('express');
const router = express.Router();
const outingscore = require('../core/outings');

router.post('/', async (req, res) => {
    const {address, radius, type, budget} = req.body;
    let outingOptions = await outingscore.generatesOuting(address, radius, type, budget);
    res.status(200).send(outingOptions);
});

module.exports = router;