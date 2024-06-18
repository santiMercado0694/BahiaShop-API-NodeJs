const {MercadoPagoConfig} = require("mercadopago");
require('dotenv').config();

mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_TOKEN
})


module.exports = {
    mercadopago
}
