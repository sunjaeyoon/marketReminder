// IMPORTS
const nodemailer = require('nodemailer');
const axios = require("axios").default;
require('dotenv').config();

// GLOBAL variables
var stocks, options;
var transporter

stocks = ['AAPL', 'VOO', 'KD', 'VHT', 'TFI'];

options = {
  method: 'GET',
  url: process.env.RAPID_URL,
  params: {region: 'US', symbols: stocks.join(',')},
  headers: {
    'x-rapidapi-host': process.env.RAPID_HOST,
    'x-rapidapi-key': process.env.RAPID_KEY
  }
};

transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

// STILL DECIDING ON BEST WAY TO FORMAT EMAIL
function sendEmail(element){
    
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_DESTINATION,
        subject: `Stock Alert: ${element.symbol} is ${element.bid}`,
        text: ''
        };
        
    transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const zip = (...arr) => {
    const zipped = [];
    arr.forEach((element, ind) => {
       element.forEach((el, index) => {
          if(!zipped[index]){
             zipped[index] = [];
          };
          if(!zipped[index][ind]){
             zipped[index][ind] = [];
          }
          zipped[index][ind] = el || '';
       })
    });
    return zipped;
 };

function main(){
    axios.request(options).then(function (response) {
        //console.log(response.data.quoteResponse);
        var stock_data = response.data.quoteResponse.result;
        //Print what we want
        stock_data.forEach(element => {
            console.log(`(${element.symbol})\t${element.bid}\t${element.shortName} `)  
        });

    }).catch(function (error) {
        console.error(error);
    });
}

main();