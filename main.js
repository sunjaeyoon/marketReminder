// IMPORTS
const nodemailer = require('nodemailer');
const axios = require("axios").default;
const cron = require('node-cron');
require('dotenv').config();

// GLOBAL variables
var stocks, values; 
var options;
var transporter

stocks = ['KD', 'VHT'];
values = [259.59,24.34];


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
function sendEmail(data){
    //console.log(data)
    data.forEach(element=>{
        //console.log(`${element[0].bid} ${element[1]}`)
        if (element[0].bid > element[1]){
            var mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: process.env.EMAIL_DESTINATION,
                subject: `Sell ${element[0].symbol}: ${element[0].bid}`,
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
    })
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
        sendEmail(zip(stock_data,values))

    }).catch(function (error) {
        console.error(error);
    });
}

// RUN PROGRAM 
main();

/*
cron.schedule('* * * * *', function() {
    var currentdate = new Date(); 
    var datetime = "Check: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    //console.log(datetime)
    main();
});*/
/*
cron.schedule('0 10-3 * * mon,tue,wed,thu,fri', function() {
    main();
});
*/