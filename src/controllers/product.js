const database = require('../database');

const getProducts = async(req, res) => {
    const response = await database.query('SELECT * FROM products');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron productos'});
    }
};

const getProductsByName = async (req, res) => {
    const nombre = req.params.name;
    
    if(typeof nombre === 'string') {
        const response = await database.query('SELECT * FROM products WHERE name = $1', [nombre]);

        if(response.rows.length > 0){
            res.status(200).json(response.rows);
        }else{
            res.status(404).json({error: 'No se encontraron productos bajo ese nombre'});
        }
    } 
};

const getProductsByCategory = async (req, res) => {
    const  categoria = req.params.category_id;
  
    if (!isNaN(categoria)) {
      const response = await database.query(
        "SELECT * FROM products WHERE category_id = $1",
        [cateogria]
      );
  
      if (response.rows.length > 0) {
        res.status(200).json(response.rows);
      } else {
        res.status(404).json({ error: "No se encontraron productos bajo esa categoria" });
      }
    }
  };

  module.exports = {
    getProducts,
    getProductsByName,
    getProductsByCategory
};