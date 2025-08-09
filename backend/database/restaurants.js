const supabase = require('../database/dbconn');

async function getAllRestaurants() {
    try {
        const result = await supabase.from('restaurants').select('*').neq('type', 'bar');
        return result.data;
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        throw error;
    }
}

async function getByType(type){
    try{
        const result = await supabase.from('restaurants').select('*').eq('type', type);
        return result.data;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getAllRestaurants,
    getByType
}