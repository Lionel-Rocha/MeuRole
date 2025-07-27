
const express = require('express');
const router = express.Router();
const cinemadb = require('../database/cinemas');
const cinemacore = require("../core/cinemas");

router.post("/", async(req, res) =>{
   const {address, radius} = req.body;
   let relevantCinemas = await cinemacore.getCinemasNearAddress(address, radius);
   res.status(200).send(relevantCinemas);
});

module.exports = router;