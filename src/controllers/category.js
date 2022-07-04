const database = require('../database');

const getCategories = async(req, res) => {
    const response = await database.query('SELECT * FROM categorias');

    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron categorias'});
    }
};

const getCategoriesNames = async(req, res) => {
    const response = await database.query('SELECT name FROM categorias');
    if(response.rows.length > 0){
        res.status(200).json(response.rows);
    }else{
        res.status(404).json({error: 'No se encontraron categorias'});
    }
};

const getCategoryById = async (req, res) => {
    const  idCategoria = req.params.id;
  
    if (!isNaN(idCategoria)) {
      const response = await database.query(
        "SELECT * FROM categorias WHERE id = $1",
        [idCategoria]
      );
  
      if (response.rows.length > 0) {
          res.status(200).json(response.rows);
      } else {
          res.status(404).json({ error: "No se encontro categoria" });
        }
    }   else {
          res.status(400).json({error: 'Categoria no encontrada bajo ese id'}); 
        }
  };

const getCategoryByName = async (req, res) => {
    const name = req.params.nombre;
    
    if(typeof name === 'string') {
        const response = await database.query('SELECT * FROM categorias WHERE nombre = $1', [name]);

        if(response.rows.length > 0){
            res.status(200).json(response.rows);
        }else{
            res.status(404).json({error: 'No se encontro categoria'});
        }
        } else {
        res.status(400).json({error: 'Categoria no encontrada bajo ese nombre'});
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    getCategoryByName,
    getCategoriesNames
};