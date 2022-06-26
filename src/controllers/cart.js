const database = require('../database');

const getContentCart = async(req, res) => {
    const response = await database.query('SELECT * FROM cart');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron productos en el carrito'});
    }
};

const updateProductQuantity = async (req, res) => {
    const id = req.params.id;
    try{
        const {quantity} = req.body;
        if(!isNaN(id)){
            const response = await db.query('UPDATE cart SET quantity = $1 WHERE id = $2',
            [quantity, id]);
            res.status(201).json({succes: 'true'});
        }else{
            res.status(400).json({error: 'invalid parameter'});
        }
    }catch(error){
        res.status(404).json({
            error: 'failed to update'});
    }
};

const deleteProduct = async (req, res) => {
    try{
        const id = req.params.id; 
        if(!isNaN(id)){
            const response = await db.query('DELETE FROM cart WHERE id = $1', [id]);
            res.status(201).json({succes: 'true'});
        }else{
            res.status(400).json({error: 'No se encontro producto con ese id'});
        }
    }catch(error){
        res.status(404).json({
            error: 'Error al querer eliminar'});
    }
};

const deleteContentCart = async(req, res) => {
    const response = await database.query('DELETE FROM cart');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'Error al querer eliminar'});
    }
};

module.exports = {
    getContentCart,
    updateProductQuantity,
    deleteProduct,
    deleteContentCart
};