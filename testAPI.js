const axios = require("axios").default;
require('dotenv').config();

var stocks = 'AAPL, VOO';

var options = {
  method: 'GET',
  url: process.env.RAPID_URL,
  params: {region: 'US', symbols: stocks},
  headers: {
    'x-rapidapi-host': process.env.RAPID_HOST,
    'x-rapidapi-key': process.env.RAPID_KEY
  }
};

axios.request(options).then(function (response) {
	console.log(response.data.quoteResponse);
    var stocks = response.data.quoteResponse.result;
    //Print what we want
    stocks.forEach(element => {
      console.log(`${element.symbol}: ${element.bid}`)  
    });
}).catch(function (error) {
	console.error(error);
});

/* // NOTE: ASYNC stuff with .then() should have code executed in .then()
async function getMarket(){
    const response = await axios.request(options);
    const data = await response;
    return data
}
getMarket().then(res=>console.log(res.data.quoteResponse))
*/