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

const addProductCart = async(req, res) => {
  const {id, name, price, stock, quantity, image_path, rating} = req.body
  console.log(req.body)
  await database.query('INSERT INTO cart (id, name, price, stock, quantity, image_path, rating) VALUES ($1,$2,$3,$4,$5,$6,$7)', [id, name, price, stock, quantity, image_path, rating], function(err, result, fields) {
      if (err) {
          res.status(400).json({error: err.message});
      }else{
          res.status(200).json({message: 'Producto añadido al carrito exitosamente'});
      }
  });
}

const updateProductStock = async (req, res) => {

  const {id, stock} = req.body
  const check_product = await database.query('SELECT * FROM products WHERE id = $1',[id]);

  if (check_product.rowCount > 0){
      await database.query('UPDATE products SET stock = $2 WHERE id = $1',[id, stock],function(err, result, fields) {
          if (err) {
              res.status(400).json({error: "Error al modificar el stock deseado del producto"});
          }else{
              res.status(200).json({message: 'Stock del producto actualizado'});
          }
      });
  }else{
      res.status(404).json({error: 'No se encontró el producto'});
  }
}

const searchProduct = async(req, res) => {
  const param = req.params.param;
  const {name} = req.body
  const response = await database.query('SELECT * FROM products WHERE name ILIKE  $1 $2 $1', [param, name]);
      res.status(200).json(response.rows);
  }

  module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    addProductCart,
    updateProductStock,
    searchProduct
};