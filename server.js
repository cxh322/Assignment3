/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/a2


*/
const express = require("express");
const path = require("path");
const data = require("./data.js");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const db= require("./db.js");
const clientSessions = require("client-sessions");



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
app.use(clientSessions({
    cookieName: "session", 
    secret: "assignment3", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));
  app.use(bodyParser.urlencoded({ extended: true}));
  
  app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    db.registerUser(req.body).then(() => {
        res.redirect("/login");
    }).catch((message) => {
      console.log(message);
        res.render("register",{data: req.body});
    })
})


app.get("/login", (req,res) => {
    res.render("login");
});
app.post("/login",(req,res) => {
    
    if(req.body.email === "" || req.body.password === "") {
        return res.render("login", { errorMsg: "Missing Email Address or Password." });
      }
      else{
      db.validateUser(req.body).then((user)=>{
        req.session.user = {
          email: user.email,
          password: user.password,
          lname: user.lname,
          fname: user.fname
          }
       res.render("dashboard",{user: req.body});
      })
      .catch((err)=>{
        console.log(err);
        res.redirect("login",{user:data});
      })
    }  
})
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } 
  else {
    next();
  }
}
function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.data.role!="admin") {
    res.redirect("/login");
  } else {
    next();
  }
}
app.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", {data: req.session.user, layout: false});
});
app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("login");
})
  
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

