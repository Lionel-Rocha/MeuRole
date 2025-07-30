
const express = require('express');
const router = express.Router();
const cinemadb = require('../database/cinemas');
const cinemacore = require("../core/cinemas");

router.post("/", async(req, res) =>{
   const {address, radius} = req.body;

   if (!address || !radius) {
      return res.status(400).send({message: "Endereço e raio são obrigatórios"});
   }

   try{
      let relevantCinemas = await cinemacore.getCinemasNearAddress(address, radius);
      res.status(200).send(relevantCinemas);
   } catch (e) {
      res.status(500).send({message: e});
   }


});

module.exports = router;