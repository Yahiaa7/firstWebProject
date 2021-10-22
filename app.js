const express = require("express");
const https = require("https");
/*
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
*/
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("mStatic"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/home.html");
});

app.get("/soso", function (req, res) {
  res.sendFile(__dirname + "/html/formAbo2Shekel.html");
});
app.post("/soso", function (req, res) {
  console.log(req.body);
  var data = req.body;

  res.send("Registration successful!");
});

app.get("/weather", function (req, res) {
  res.sendFile(__dirname + "/html/weather.html");
});
app.post("/weather", function (req, res) {
  const cityName = req.body.cityName;

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=metric&appid=fbed14955f546626337dad1c76879f9c";

  https.get(url, function (response) {
    console.log(response.statusMessage);
    response.on("data", function (data) {
      const mData = JSON.parse(data);
      console.log(mData);
      res.write(
        "The Temperature in " + cityName + " is " + mData.main.temp + "C"
      );
      res.send();
    });
  });
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
  const mUrl = "https://us5.api.mailchimp.com/3.0/lists/d714192473";
  const options = {
    method: "POST",
    auth: "Fancy:1e334ab09d170affd156113e33231315-us5",
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
  res.redirect("/html/emailMe");
});

app.post("/success", function (req, res) {
  res.redirect("/html/emailMe");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server Started on Port 3000");
});
