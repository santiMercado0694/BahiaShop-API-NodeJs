require('dotenv').config({ path: "src/.env" })
const swagger = require('../swagger');
const cors = require('cors');

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//Swagger
app.use(
    '/swagger',
    swagger.serve, 
    swagger.setup
  );

//Routes
app.use(require('./routes.js'))

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})