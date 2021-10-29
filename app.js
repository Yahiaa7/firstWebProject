const express = require("express");
const https = require("https");
/*
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
*/
const app = express();

var openWeatherApi = config.openWeatherApi;
var mailChimpApi = config.mailChimpApi;
var mailChimpListsID = config.mailChimpListsID;

var todoListItems = [];

var cityName = "";

var Temp = "";

var soso = "";
var username = "";
var ProblemSolving = "off";
var Logical = "off";
var Advanced = "off";
var Analysis = "off";
var Planning = "off";
var radio = "";
var book = "";
var brief = "";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("mStatic"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/home.html");
});

app.get("/soso", function (req, res) {
  res.render("formAbo2Shekel", {
    soso: soso,
    username: username,
    ProblemSolving: ProblemSolving,
    Logical: Logical,
    Advanced: Advanced,
    Analysis: Analysis,
    Planning: Planning,
    radio: radio,
    book: book,
    brief: brief,
  });
});
app.post("/soso", function (req, res) {
  // console.log(req.body);
  var data = req.body;
  soso = req.body;
  username = data.username;
  ProblemSolving = data.ProblemSolving;
  Logical = data.Logical;
  Advanced = data.Advanced;
  Analysis = data.Analysis;
  Planning = data.Planning;
  radio = data.radio;
  book = data.book;
  brief = data.brief;

  res.render("form2SResult", {
    soso: soso,
    username: username,
    ProblemSolving: ProblemSolving,
    Logical: Logical,
    Advanced: Advanced,
    Analysis: Analysis,
    Planning: Planning,
    radio: radio,
    book: book,
    brief: brief,
  });
});

app.get("/weather", function (req, res) {
  //res.sendFile(__dirname + "/html/weather.html");
  res.render("weather", { cityName: cityName, Temp: Temp });
});
app.post("/weather", function (req, res) {
  cityName = req.body.cityName;

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=metric&appid=" +
    openWeatherApi;
 

  https.get(url, function (response) {
    console.log(response.statusMessage);
    response.on("data", function (data) {
      const mData = JSON.parse(data);
      console.log(mData);
      Temp = mData.main.temp;

      res.redirect("weather");
      /*res.render("weatherResult", {
        cityName: cityName,
        Temp: mData.main.temp,
      });
      /*res.write(
        "The Temperature in " + cityName + " is " + mData.main.temp + "C"
      );
      res.send();*/
    });
  });
});

app.post("/changeCity", (req, res) => {
  res.redirect("/weather");
});

app.get("/emailMe", function (req, res) {
  res.sendFile(__dirname + "/html/signUp.html");
});

app.post("/emailMe", function (req, res) {
  // res.write("First Name is: " + req.body.first_name);
  // res.write("Last Name is: " + req.body.last_name);
  // res.write("Email is: " + req.body.email);
  // res.send();
  // console.log(res.statusCode);

  var data = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.first_name,
          LNAME: req.body.last_name,
        },
      },
    ],
  };

  const jData = JSON.stringify(data);
  const mUrl = "https://us5.api.mailchimp.com/3.0/lists/"+mailChimpListsID;
  const options = {
    method: "POST",
    auth: "Fancy:"+mailChimpApi,
    //sssssssssssssssssssssssssssssssssssssssss
  };

  const request = https.request(mUrl, options, function (response) {
    response.on("data", (data) => {
      // console.log(JSON.parse(data));
      console.log(response.statusCode);
      response.statusCode == 200
        ? res.sendFile(__dirname + "/html/Success.html")
        : res.sendFile(__dirname + "/html/Failed.html");
    });
  });
  request.write(jData);
  request.end();
});

//1e334ab09d170affd156113e33231315-us5  api key
//d714192473  list id

app.post("/failed", function (req, res) {
  res.redirect("/emailMe");
});

app.post("/success", function (req, res) {
  res.redirect("/emailMe");
});

app.get("/todoList", (req, res) => {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("todoList", { day: day, items: todoListItems });
});

app.post("/todoList", (req, res) => {
  var item = req.body.listItem;
  console.log(item);
  todoListItems.push(item);

  res.redirect("/todoList");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server Started on Port 3000");
});
