
/*
    Check and process fetch 'response' errors
*/
function CheckResponseError(response) {
    if (response.status >= 200 && response.status < 300) {
        // throw Error(response.statusText);
        return response.json();
    } 
    // 300 responses: resource has moved
    else if (response.status >= 300 && response.status < 400) {
        throw Error(response.status + ': ' + response.statusText);
    }
    // 400 responses: bad user supplied data
    else if (response.status >= 400 && response.status < 500) {
        throw Error(response.status + ': ' + response.statusText);
    } 
    // 500 or other: server or API error
    else {
        throw Error(response.status + ': ' + response.statusText);
    }
}

// create the base payload structure and values, for continuity
function Payload( data = {} ){
    return {
        status: data.status ? data.status : false,
        message: data.message ? data.message : 'Nothing happened',
        data: data.data ? data.data : {},
    };
}



/**
 * 
 */
 const MIN_WAIT_MSECS = 10000;

 /**
  * max # of wait retires
  */
 const MAX_RETRIES = 5;
 
 /**
  * Decide about the time to wait for a retry
  * - only retry {@link MAX_RETRIES} times
  * - when waiting wait at least {@link MIN_WAIT_MSECS}
  * @param {Integer} millisecondsToWait
  * @param {Integer} rateLimitRemaining parsed from "x-ratelimit-remaining" header
  * @param {Integer} nthTry how often have we retried the request already
  * @param {Object} response as returned from fetch
  * @return {Integer} milliseconds to wait for next try or < 0 to deliver current response
  */
 function defaultWaitDecide(
   millisecondsToWait,
   rateLimitRemaining,
   nthTry,
   response
 ) {
   if (nthTry > MAX_RETRIES) return -1;
 
   return millisecondsToWait + MIN_WAIT_MSECS;
 }
 
 /**
  * Waits and retries after rate limit rest time has reached.
  * @see https://auth0.com/docs/policies/rate-limit-policy
  * @see https://developer.github.com/v3/#rate-limiting
  * @see https://opensource.zalando.com/restful-api-guidelines/#153
  * @param fetcher executes the fetch operation
  * @param waitDecide
  */
 async function rateLimitHandler(fetcher, waitDecide = defaultWaitDecide) {
   for (let i = 0; ; i++) {
     const response = await fetcher();
 
     switch (response.status) {
       default:
         return response;
 
       case 403:
       case 429:
         const rateLimitReset = parseInt(
           response.headers.get("x-ratelimit-reset")
         );
 
         let millisecondsToWait = isNaN(rateLimitReset)
           ? 0
           : new Date(rateLimitReset * 1000).getTime() - Date.now();
 
         millisecondsToWait = waitDecide(
           millisecondsToWait,
           parseInt(response.headers.get("x-ratelimit-remaining")),
           i,
           response
         );
         if (millisecondsToWait <= 0) {
           return response;
         }
         await new Promise(resolve => setTimeout(resolve, millisecondsToWait));
     }
   }
 }
 


// export the router for actual use
module.exports = { Payload, CheckResponseError, rateLimitHandler };