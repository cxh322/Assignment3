/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/a2

This version only completes the connection to the mongoose database

*/
const express = require("express");
const path = require("path");
const data = require("./data.js");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const db= require("./db.js");

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }



app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: "main",
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    } 
}));
app.set("views", "./views");
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// default route
app.get("/",(req,res)=>{
    data.getAllMeal().then((data)=>{
            res.render("home",{title: "Home", data: data});
        }).catch((err)=>{
        res.render("home");
    });
});


//meals Route
app.get("/meals",(req,res)=>{
    data.getAllPack().then((data)=>{
        res.render("meals",{data:data});
    }).catch((err)=>{
        res.render("meals");
    });
});


//login route

app.get("/login",(req,res)=>{
    res.render("login");
});


app.post("/login",(req,res)=>{
    data.validateLogin(req.body).then(()=>{
        res.render("dashboard",{data: req.body});
    }).catch((data)=>{
        res.render("login",{data:data});
    });
});

//regiter routes

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    data.validateRegister(req.body).then(()=>{
        res.redirect("/login");
    }).catch((data)=>{
        res.render("register",{data:data});
    });
});


//catch-all
app.use((req,res)=>{
    res.status(404).send("Nothing to see here, move along");
});


db.initialize().then(data.initialize).then(()=>{
    console.log("Data read successfully");
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((data)=>{
    console.log(data)
})

