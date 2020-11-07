const express = require("express");
const script = express();
const request = require("request");
const fs = require('fs');

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
    const inputValue = req.body.check;
    if (inputValue == "Check prices & volume")
        res.redirect(`/stocks/${stockName}`);
    else
        res.redirect(`/stocks/${stockName}/graph`);
});


script.get("/markets", function(req, res) {
    res.render("markets", {
        tickers: tickers
    })
});

script.get("/markets/:marketName", function(req, res){
    var marketName = req.params.marketName;
    request("http://api.marketstack.com/v1/tickers?access_key=3e2acadd993217be01bec6ee29166404&exchange=" + marketName, function(error, response, body) {
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
    request("http://api.marketstack.com/v1/eod?access_key=3e2acadd993217be01bec6ee29166404&symbols=AAPL,MSFT,TSLA,AMZN,FB,NFLX", function(error, response, body) {
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


script.get ("/stocks/:stock/graph", function(req, res) {
    var stockName = req.params.stock;
    request("http://api.marketstack.com/v1/eod?access_key=3e2acadd993217be01bec6ee29166404&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("chart", {
                info: parsedData,
                stockName: stockName
            });;
        }
    });
    
});



script.get ("/stocks/:stock", function(req, res) {
    var stockName = req.params.stock;
    request("http://api.marketstack.com/v1/eod?access_key=3e2acadd993217be01bec6ee29166404&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName
            });;
        }
    });
    
});

script.get("/stocks/:marketName/:stockName", function(req, res){
    const marketName = req.params.marketName;
    const stockName = req.params.stockName;

    request("http://api.marketstack.com/v1/eod?access_key=3e2acadd993217be01bec6ee29166404&exchange=" + marketName + "&symbols=" + stockName, function(error, response, body) {
        if (error)
            console.log(error);
        else {
            var parsedData = JSON.parse(body);
            res.render("stock", {
                info: parsedData,
                stockName: stockName,
            });;
        }
    });
});

script.get("*", function(req, res) {
    res.send("Error 404. Page not found");
});

const PORT = process.env.PORT || 3000;
script.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
