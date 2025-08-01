const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cinemas = require('./routes/cinemas');
const outings = require("./routes/outings");
const restaurants = require('./routes/restaurants');
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());

app.use('/cinema', cinemas);
app.use('/outings', outings);
app.use('/restaurants', restaurants);
app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');


});