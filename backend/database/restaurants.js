const supabase = require('../database/dbconn');

async function getAllRestaurants() {
    try {
        const result = await supabase.from('restaurants').select('*')
        return result.data;
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        throw error;
    }
}

module.exports = {
    getAllRestaurants
}