const Joi = require('joi');
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

// load the required utils
const { Payload, CheckResponseError, rateLimitHandler } = require('../utils');
// const { rateLimitHandler } = require('fetch-rate-limit-util');

// import { rateLimitHandler } from "fetch-rate-limit-util";
// const { rateLimitHandler } = import('fetch-rate-limit-util');
// import("fetch-rate-limit-util").default;


var limit = require("simple-rate-limiter");
const elasticsearch = require("elasticsearch");


let ratePerMin = 300/15;
let ratePerSec = ratePerMin / 60;
let lastTwitterCall;
let lastRateLimitExceeded;

if ( lastTwitterCall == null )
    setLastTwitterCall();

function setLastRateLimitExceeded(){
    lastRateLimitExceeded = +new Date();
}
function setLastTwitterCall(){
    lastTwitterCall = +new Date();
}

function rateLimited(){
    let now = +new Date();
    if ( now - lastTwitterCall > 1000 / ratePerSec ){
        setLastTwitterCall();
        return false;
    }
    else
        return true;
}


// initialize the Elastic Search client
const elastic = elasticsearch.Client({
    host: process.env.ELASTIC_ADDR,
});


/*
    Validate any supplied search query string used to search for a space
*/
function validateQuery( query ){
    return Joi.object({
        text: Joi.string().min(3).required(),
    }).validate(query);
}


/*
    Retreive the most recent saved Spaces (aka load the Spaces homepage)
*/
router.get("/", (req, res) => {
    
    

    // console.log(ratePerMin);
    // console.log(ratePerSec);
    // console.log(now);
    // console.log(lastTwitterCall);

    // perform the input validation on the req.query
    // const { error } = validateQuery(req.query)
    // if ( error ){
    //     return res.status(400).send(new Payload({ 
    //         message: error.details[0].message 
    //     }));
    // }

    // init the payload
    let payload = new Payload({message:'Welcome to Spaces'});

    res.send(payload);
});

/*
    Search for spaces with the supplied search paramaters
*/
router.get("/search", async (req, res) => {

    // perform the input validation on the req.query
    const { error } = validateQuery(req.query)
    if ( error ){
        // console.log(error);
        // res.status(400).send(new Payload({ 
        //     message: error.details[0].message 
        // }));
        res.status(200).send(new Payload({ 
            message: error.details[0].message,
        }));
        return;
    }

    // create the payload
    // let payload = new Payload({status: true});
    // payload = await searchTwitter( req.query );
    // res.send(payload);
    // return;

    // this will search twitter in the background

    // console.debug('START elastic search');
    let spaces = [];
    let users = [];

    await searchTwitter( req.query );

    // search and record the twitter api if rate limitting is not active
    // if ( !rateLimited() ){
    //     // console.log('');
    //     // spaces = tmp.spaces;
    //     // users = tmp.users;
    // }
    // else
    //     console.log('rate limit protection');
    
    let tmp = await searchElastic( req.query );
    spaces = tmp.spaces;
    users = tmp.users;
    

    // console.debug('END elastic search');

    // ensure at least some spaces were found
    if ( !spaces || spaces.length <= 0 ){
        res.status(200).send(new Payload({ 
            message: 'No spaces found...',
        }));
        return;
    }
    
    // create the payload
    let payload = new Payload({
        status: true,
        message: 'Search complete',
        data: {
            spaces: spaces,
            users: users,
        }
    });

    // send the response from the server
    res.send(payload);

});

async function searchElastic( searchQuery ){
    
    // save the search query
    saveSearchToElastic( searchQuery );

    const { spaces, userSearch } = await searchElasticSpaces( searchQuery );
    
    const users = await searchElasticUsers( userSearch );

    return { spaces, users };
}

async function searchElasticSpaces( searchQuery ){
    let spaces = [];
    let userSearch = [];

    await elastic.search({
        "from" : 0, "size" : 100, // max of 100 results returned
        index: "spaces",
        body: {
            sort: [
                { "participant_count": { "order": "desc" } },
                { "created_at": { "order": "desc" } },
            ],
            query: {
                wildcard: {
                    "title": `*${searchQuery.text.trim()}*`
                }
            },
        }
    })
    .then(response => {
        // console.log('search spaces: complete');
        
        // post process each of the 'spaces' results
        for (const key in response.hits.hits) {
            let space = response.hits.hits[key]._source;

            // only return live spaces withing the last 24 hours
            if ( space.state == 'live' && (Date.parse(space.created_at) > +new Date() - 24*60*60*1000) ){

                // create the url text for the space
                // TODO: 

                // add the current space to the payload spaces
                spaces.push(space);

                // add CREATOR to the search listing
                userSearch.push(space.creator_id);

                // add each of the HOSTS to the search listing
                if ( space.host_ids ) {
                    for ( i in space.host_ids){
                        userSearch.push(space.host_ids[i]);
                    }
                }

                // add each of the SPEAKERS to the search listing
                if ( space.speaker_ids ) {
                    for ( i in space.speaker_ids){
                        userSearch.push(space.speaker_ids[i]);
                    }
                }

                // console.log('space name: ' + space.title);
            }
        }
        
    })
    .catch(err => {
        console.log('SPACES SEARCH ERROR');
        console.log(err);
        // return res.status(500).json({"message": "Error"})
    });

    return { spaces, userSearch };
}

async function searchElasticUsers( userSearch ){
    let users = [];

    await elastic.search({
        index: "users",
        body: {
            "from" : 0, "size" : 1000,
            query: {
                "terms" : { 
                    _id : userSearch,
                }
            }
        }
    })
    .then(response => {
        console.log('search users: complete');

        // console.log(response);

        // post process each of the user results
        for (const key in response.hits.hits) {
            let user = response.hits.hits[key]._source;

            users.push(user);
        }


    })
    .catch(err => {
        console.log('USER SEARCH ERROR');
        console.log(err);
        // return res.status(500).json({"message": "Error"})
    })
    
    return users;
}


function saveSpacesToElastic( spaces ){

    console.log('SAVING SPACES...');

    // loop through each of the spaces
    for (const key in spaces) {
        let space = spaces[key];

        if (space.id == '1MnxnkqbYqBKO')
            space.participant_count = 999;

        if ( !space.speaker_ids )
            space.speaker_ids = [];
        if ( !space.host_ids )
            space.host_ids = [];

        // add the space to the database (will also update if it already exists)
        elastic.index({
            index: 'spaces',
            id: space.id,
            body: {
                "creator_id": space.creator_id,
                "host_ids": [...space.host_ids],                
                "speaker_ids": [...space.speaker_ids],
                ...space,
                // "title": space.title,
                // "price": space.price,
                // "description": space.description,
            }
        })
        .then(response => {
            // console.log(`added/updated SPACE=${space.id}`);
            // return res.json({"message": "Indexing successful"})
        })
        .catch(err => {
            console.log(`ERROR ON ${space.id}`);
            console.error(err);
            // return res.status(500).json({"message": "Error"})
        })
    }

    return;
}


function saveSearchToElastic( searchQuery ){

    // console.log('SAVING SEARCH...');

   
    // record the search query to the database
    elastic.index({
        index: 'searches',
        body: {
            "timestamp": +new Date(),
            ...searchQuery,
        }
    })
    .then(response => {
        // console.log(`added/updated SPACE=${space.id}`);
        // return res.json({"message": "Indexing successful"})
    })
    .catch(err => {
        console.log(`ERROR ON SAVING SEARCH QUERY`);
        console.error(err);
        // return res.status(500).json({"message": "Error"})
    })
    

    return;
}

async function saveUsersToElastic( users ){

    console.log('SAVING USERS...');

    // loop through each of the users
    for (const key in users) {
        let user = users[key];

        // add the space to the database (will also update if it already exists)
        await elastic.index({
            index: 'users',
            id: user.id,
            body: {
                ...user,
            }
        })
        .then(response => {
            // console.log(`added/updated user: @${user.username} : ${user.id}`);
            // return res.json({"message": "Indexing successful"})
        })
        .catch(err => {
            console.log(`ERROR ON ${user.id}`);
            console.log(err);
            // return res.status(500).json({"message": "Error"})
        })
    }

    return;
}

async function searchTwitter( searchQuery ){
    
    // init the payload
    let payload = new Payload();

    console.log('twitter api - search for: '+searchQuery.text);
    

    // extract and prepare the query data
    let query = {
        addr: 'https://api.twitter.com/2/spaces/search',
        params: {
            'query': searchQuery.text,
            'state': 'live', // all, live, scheduled
            'space.fields' : 'updated_at,created_at,title,creator_id,speaker_ids,participant_count,host_ids,scheduled_start,lang',
            'expansions': 'host_ids,invited_user_ids,speaker_ids',
            'user.fields': 'username,profile_image_url,verified',
            'max_results': '100',
        }
    }

    // construct the query string and addr for the Twitter API call
    let queryString = ''; // must be an empty string to start
    Object.keys(query.params).forEach(key => {
        if ( key !== null )
            queryString += `&${key}=${query.params[key]}`;
    });
    let queryAddr = `${query.addr}?` + queryString.substring(1);

    // console.log(`Request address: ${queryAddr}`);
    // payload.message = queryAddr;

    // define the headers to use for the twitter api call
    let headers = {
        "Accept": "*/*",
        "User-Agent": "Spacebird.io (https://spacebird.io)",
        "Authorization": `Bearer ${process.env.TWITTER_BEARER}`,
    }

    console.log('twitter api call');

    // update the rate limit tracker
    // setLastTwitterCall();

    // const MIN_WAIT_MSECS = 0;
    const response = rateLimitHandler( () => fetch(queryAddr, { 
            method: "GET",
            headers: headers
        })
    );
    await response.then( CheckResponseError )
    .then(data => {
        payload.message = null;

        // construct the 'data' payload to send to the user
        payload.data = {
            spaces: data.data ? data.data : [],
            users: data.includes && data.includes.users !== undefined ? data.includes.users : [],
        }

        // logs some stuff
        // console.log(`total spaces: ${payload.data.spaces.length}`);
        // console.log(`total users: ${payload.data.users.length}`);

        // console.log('twitter api call - end');
    })
    .catch(err => {
        console.log('twitter api ERROR');
        console.error(err);
        payload.message = 'Server error';
        // res.status(400).send(payload);
        
    })

    // fetch the twitter api
    

    // save the results from the twitter search to elastic search
    if ( payload.data.spaces )
        saveSpacesToElastic( payload.data.spaces );
    if ( payload.data.users )
        saveUsersToElastic( payload.data.users );

    return payload.data;
}

// export the router for actual use
module.exports = router;