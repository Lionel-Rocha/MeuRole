const dbconnection = require('./dbconn');
const axios = require('axios');
const supabase = require('../database/dbconn');

async function getAllCinemas() {
    try {
        const result = await supabase.from('cinemas').select('*')
        return result.data; // Retorna explicitamente o resultado
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        throw error; // Considerar criar um erro customizado se necessário
    }
}



module.exports = {
    getAllCinemas
}