const {Preference} = require("mercadopago");
const {mercadopago} = require('../utils/mercadopago.js')

const processPayment = async (req, res) => {

    (new Preference(mercadopago)).create({
        body: {
            items: req.body.items
        },
        back_urls: req.body.back_urls
    })
        .then( result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({error: error})
        });

}

module.exports = {
    processPayment
}