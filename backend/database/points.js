const supabase = require('../database/dbconn');

async function getAllPoints(){
    try {
        const result = await supabase.from('points').select('*')
        return result.data; // Retorna explicitamente o resultado
    } catch (error) {
        console.error('Error fetching points of interest:', error);
        throw error; // Considerar criar um erro customizado se necessário
    }
}

module.exports = {
    getAllPoints
}