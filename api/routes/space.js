const Joi = require('joi');
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

// const elasticsearch = require("elasticsearch");
// const bodyParser = require("body-parser");

// initialize the Elastic Search client
// const elastic = elasticsearch.Client({
//     host: process.env.ELASTIC_ADDR,
// })

// load the required utils
const { Payload, CheckResponseError } = require('../utils');

/*
    Validate any supplied search query string used to search for a space
*/
function validateQuery( query ){
    return Joi.object({
        text: Joi.string().min(3).required(),
    }).validate(query);
}


/*
    
*/
router.get("/", (req, res) => {
    
    // perform the input validation on the req.query
    // const { error } = validateQuery(req.query)
    // if ( error ){
    //     return res.status(400).send(new Payload({ 
    //         message: error.details[0].message 
    //     }));
    // }

    // init the payload
    let payload = new Payload({message:'Spaced out'});

    res.send(payload);
});

/*
    Search for spaces with the supplied search paramaters
*/
// router.get("/search", async (req, res) => {

// });



// export the router for actual use
module.exports = router;