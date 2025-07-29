const supabase = require('../database/dbconn');

async function getAllCinemas() {
    try {
        const result = await supabase.from('cinemas').select('*')
        return result.data; // Retorna explicitamente o resultado
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        throw error;
    }
}



module.exports = {
    getAllCinemas
}