const database = require('../database');

const getProducts = async(req, res) => {
    const response = await database.query('SELECT * FROM products');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron productos'});
    }
};

const getProductById = async (req, res) => {
  const  idProducto = req.params.id;

  if (!isNaN(idProducto)) {
    const response = await database.query(
      "SELECT * FROM products WHERE id = $1",
      [idProducto]
    );

    if (response.rows.length > 0) {
        res.status(200).json(response.rows);
    } else {
        res.status(404).json({ error: "No se encontro producto" });
      }
  }   else {
        res.status(400).json({error: 'Producto no encontrado bajo ese id'}); 
      }
};

const getProductByName = async (req, res) => {
    const nombre = req.params.name;
    
    if(typeof nombre === 'string') {
        const response = await database.query('SELECT * FROM products WHERE name = $1', [nombre]);

        if(response.rows.length > 0){
            res.status(200).json(response.rows);
        }else{
            res.status(404).json({error: 'No se encontro producto'});
        }
      } else {
            res.status(400).json({error: 'Producto no encontrado bajo ese nombre'}); 
        }
};

const getProductsByCategory = async (req, res) => {
    const  categoria = req.params.category_id;
  
    if (!isNaN(categoria)) {
      const response = await database.query(
        "SELECT * FROM products WHERE category_id = $1",
        [categoria]
      );
  
      if (response.rows.length > 0) {
        res.status(200).json(response.rows);
      } else {
        res.status(404).json({ error: "No se encontraron productos bajo esa categoria" });
      }
    }
  };

  const addProductCart = async (req, res) => {

    try{
        const {id, name, price, stock, quantity, image_path} = req.body;
        const response = await db.query('INSERT INTO cart (id, name, price, stock, quantity, image_path) VALUES ($1,$2,$3,$4,$5,$6)',
        [id, name, price, stock, quantity, image_path]);

        res.status(201).json({succes: 'true'});
    }catch(error){
        res.status(404).json({
            error: 'failed to add'});
    }
};

  module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    addProductCart
};