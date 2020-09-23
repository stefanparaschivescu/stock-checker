const express = require("express");
const script = express();
const request = require("request");
const fs = require('fs');
const lodash = require("lodash");

script.use(express.json() );
script.use(express.urlencoded({
    extended: true
}));

script.use(express.static("public"));

script.set("view engine", "ejs");

let rawdata = fs.readFileSync('public/db/tickers.json');
let tickers = JSON.parse(rawdata);

script.get('/', function (req, res) {
    res.render('homepage');

});

script.post("/", function (req, res) {
    const stockName = req.body.stock;
    const stockMarket = req.body.market;
    console.log(stockName);
    console.log(stockMarket);

    request("http://api.marketstack.com/v1/eod?access_key=720d5dfa9f8e16db10ddda0d8607f4ec&exchange=" + tickers[stockMarket-1].symbol + "&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName,
                lodash: lodash
            });
            console.log(parsedData);
        }
    });

    // res.end();
});


script.get("/markets", function(req, res) {
    request("name", function(error, response, body) {
        if (error)
            res.send(error);
        else {
            res.render("market", {
                info: parsedData,
                stockName: stockName
            });
        }
    });
});

script.get("/stocks", function(req,res) {
    var stockName = req.query.stock;
    request("ceva cu stockName", function(error, response, body) {
        if (error)
            res.send(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName
            });
        }
    });
});


script.get ("/stocks/:stock", function(req, res) {
    var stockName = req.params.stock;
    request("http://api.marketstack.com/v1/eod?access_key=720d5dfa9f8e16db10ddda0d8607f4ec&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName
            });
            console.log(parsedData);
        }
    });
    
});

script.get("*", function(req, res) {
    res.send("Error 404. Page not found");
});

script.listen(3000, function() {
    console.log("Welcome to StockChcker!");
});
