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
    const {id, quantity} = req.body
    const check_product = await database.query('SELECT * FROM cart WHERE id = $1',[id]);
    if (check_product.rowCount > 0){
        await database.query('UPDATE cart SET quantity = $2 WHERE id = $1',[id, quantity],function(err, result, fields) {
            if (err) {
                res.status(400).json({error: "Algo salió mal"});
            }else{
                res.status(200).json({message: 'Producto modificado satisfactoriamente'});
            }
        });
    }else{
        res.status(404).json({error: 'No se encontró el producto'});
    }
}

const deleteProduct = async(req, res) => {
    if(!isNaN(req.params.id)){
        const check_product = await database.query('SELECT * FROM cart WHERE id = $1',[req.params.id]);
        if (check_product.rowCount > 0){
            await database.query('DELETE FROM cart WHERE id = $1',[req.params.id],function(err, result, fields) {
                if (err) {
                    res.status(400).json({error: 'Algo salió mal'});
                }else{
                    res.status(200).json({message: 'Producto eliminado satisfactoriamente'});
                }
            });
        } else{
            res.status(404).json({error: 'No existe el ingrediente'});
        }
    }else{
        res.status(400).json({error: 'Parámetro inválido'});
    }
}

const deleteContentCart = async(req, res) => {
    const response = await database.query('DELETE FROM cart');

    if(response.rows.length > 0){
        res.status(404).json({error: 'Error al querer eliminar'});
    }else{      
        res.status(201).json({succes: 'Se borro el contenido del carrito'});
    }
};

module.exports = {
    getContentCart,
    updateProductQuantity,
    deleteProduct,
    deleteContentCart
};