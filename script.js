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

    res.redirect("/stocks/" + tickers[stockMarket-1].symbol + "/" + stockName)
});


script.get("/markets", function(req, res) {
    res.render("markets", {
        tickers: tickers
    })
});

script.get(":marketName", function(req, res){
    var marketName = req.params.marketName;
    request("http://api.marksetstack.com/v1/tickers?access_key=720d5dfa9f8e16db10ddda0d8607f4ec&exchange=" + marketName, function(error, response, body) {
    if (error)
        console.log(error);
    else {
        var parsedData = JSON.parse(body);
            res.render("market", {
            info: parsedData,
            marketName: marketName
            });
        }
    });
});

script.get("/stocks", function(req,res) {
    request("http://api.marketstack.com/v1/eod?access_key=720d5dfa9f8e16db10ddda0d8607f4ec&symbols=AAPL,MSFT,TSLA,AMZN,FB,NFLX", function(error, response, body) {
        if (error)
            res.send(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("importantStocks", {
                info: parsedData
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

script.get("/stocks/:marketName/:stockName", function(req, res){
    const marketName = req.params.marketName;
    const stockName = req.params.stockName;

    request("http://api.marketstack.com/v1/eod?access_key=720d5dfa9f8e16db10ddda0d8607f4ec&exchange=" + marketName + "&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName,
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
