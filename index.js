require('dotenv').config({ path: "./.env" });
const cors = require('cors');
const compression = require('compression');

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

//Routes Ecommerce
app.use(require('./src/routes.js'));

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

