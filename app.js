const express = require('express');
const app = express();
require('dotenv').config();
const fetch = require('node-fetch');
const port = process.env.PORT | 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
   fetch('http://api.ipstack.com/check?access_key='+process.env.location_apikey)
   .then(responce => responce.json())
   .then(data => {
       console.log(data);
       if(data.city != null)
       {   const url = encodeURI('http://api.openweathermap.org/data/2.5/weather?q='+data.zip+','+data.country_code+'&appid='+process.env.weather_apikey);
           fetch(url)
           .then(responce1 => responce1.json())
           .then(body => {
               if(body.cod === 200)
               {
                   res.render('index', {weather: body});
               }
               else{
                   console.log(body.message);
                res.render('landing');
              }
           })
           .catch(err=> console.log(err));
       }
       else{
           res.render('landing');
       }
   })
   .catch(err => console.log("Error: " + err));

//    res.render('landing');
})
app.post('/', (req, res) => {
    let city = req.body.city;
    let query;
    if(isNaN(city))
    query = 'q=' + city;
    else{
        query = "zip=" + city + ',in';
    }
    fetch('http://api.openweathermap.org/data/2.5/weather?' + query + '&appid=3bf3127724118f52a85ba086b9ffa7fb')
            .then(res => res.json())
            .then(body => {
                if(body.cod == 200)
                {
                    res.render('index', {weather: body});  
                }
                else{
                    console.log(body.message);
                    res.redirect('/');
                }})
})

    app.listen(port, () => console.log("Server is running"));


        