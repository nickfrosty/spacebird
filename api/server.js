const Joi = require('joi');
const express = require("express");
const fetch = require('node-fetch');
// const validator = require('express-joi-validation').createValidator({})
const cors = require('cors');
// const { response } = require("express");

// load the required utils
const { Payload, CheckResponseError } = require('./utils');

// prepare the express app
const app = express();
require('dotenv').config();
app.use(express.json());


// set the allowable domains to make requests via CORS
app.use(cors({
    // origin: '*'
    origin: [
        // 'http://localhost:3000', 
        'https://www.spacebird.io*',
        'https://www.spacebird.io',
        'https://spacebird.io*',
        'https://spacebird.io',
        'https://www.spacebird.io/', 
        'https://spacebird.io/'
    ]
}));

// inistialize the NODE server
const NODE_PORT = process.env.NODE_PORT || 3000;
app.listen(NODE_PORT, () => {
    console.log(`Node server running. Listening on port http://localhost:${NODE_PORT}`);
})





/**********************************************************************/
/**********************************************************************/
/**********************************************************************/


app.get("/", (req, res) => {

    // // perform the input validation on the req.query
    // if (  { error } = validateSpaceSearch(req.query) ){
    //     return res.status(400).send(new Payload({ 
    //         message: error.details[0].message 
    //     }));
    // }


    // Access the provided 'page' and 'limt' query parameters
    // let page = req.query.page;
    // let limit = req.query.limit;

    // create the default payload structure
    let payload = new Payload({ message: 'Nothing to see here' });

    // return the default 
    res.send( payload );


});


/**********************************************************************/
/**********************************************************************/
/**********************************************************************/


const importSpaces = require("./routes/spaces");
app.use('/spaces', importSpaces);

// app.use('/space', require("./routes/space"));




/**********************************************************************/
/**********************************************************************/
/**********************************************************************/
