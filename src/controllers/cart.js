const database = require('../database');

const getContentCart = async(req, res) => {
    const response = await database.query('SELECT * FROM cart');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron productos'});
    }
};

module.exports = {
    getContentCart
};