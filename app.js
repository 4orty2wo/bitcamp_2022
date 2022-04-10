const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const dotenv= require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const { NULL } = require('mysql/lib/protocol/constants/types');
const { count } = require('console');
const { query } = require('express');

dotenv.config({path: './.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, "./public")
app.use(express.static(publicDirectory))


app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.set("view engine", "hbs");

db.connect((error)=> {
    if(error) {
        console.log(error)
    }
    else{
        console.log("MY SQL Connected..")
    }
})

//Define Routes
app.use("/", require("./routes/pages"))
app.use("/auth", require("./routes/auth"));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 *60 * 60 *24 }
}));


app.listen(5001, () => {
    console.log("Sever started on Port 5001")
});

app.post('/auth/index', function(req, res) {
    // const {username, password} = req.body;
    // if (username && password) {
    //     db.query('SELECT username,password FROM account WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    //         if (results.length > 0) {
    //             req.session.loggedin = true;
    //             req.session.username = username;
                res.redirect("/quiz");
    //         }
    //         else{   
    //             return res.render("index",{
    //             message: "Incorrect Username and/or Password"
    //             });
    //         }
    //     });
    // }
}); 

app.post('/createAccount', function(req, res) {
    res.redirect("/quiz");
});

app.get('/createAccount', function(req, res) {
    res.render("createAccount");
});

app.get('/quiz', function(req, res) {
    res.render("quiz");
});

app.post('/results', function(req, res) {
    res.redirect("/results");
});

app.get('/results', function(req, res) {
    var{rooms, bathrooms, residential, condominium, units, zipcode, 
        poorCond, faitCond, avgCond, goodCond, veryGoodCond, excellentCond} = req.body;
        var temp = 0;
        var temp2 = 0;
        var condTemp = 0;
    if (req.session.loggedin){
        var queryString = "WHERE rooms = " + rooms + " AND bathrooms = " + bathrooms + " AND type IN (";
        if(residential==1){
            queryString += "residential";
            temp = 1;
        }
        if(condominium==1){
            temp2 = 1;
            if(temp==1){
                queryString += ", codominium)";
            }
            else{
                queryString += "condominium)";
            }
        }
        if(temp2==0){
            queryString += ")";
        }
        if(units==0){
            queryString += " AND units = 1";
        }
        queryString += " AND condition IN (";
        if(poorCond==1){
            queryString += "poor";
            condTemp = 1;
        }
        if(fairCond==1){
            if(condTemp==0){
            queryString += "fair";
            }
            else{
                queryString += ", fair";
            }
            condTemp = 1;
        }
        if(avgCond==1){
            if(condTemp==0){
            queryString += "average";
            }
            else{
                queryString += ", average";
            }
            condTemp = 1;
        }
        if(goodCond==1){
            if(condTemp==0){
            queryString += "good";
            }
            else{
                queryString += ", good";
            }
            condTemp = 1;
        }
        if(veryGoodCond==1){
            if(condTemp==0){
            queryString += "'very good'";
            }
            else{
                queryString += ", 'very good'";
            }
            condTemp = 1;
        }
        if(excellentCond==1){
            if(condTemp==0){
            queryString += "excellent";
            }
            else{
                queryString += ", excellent";
            }
            condTemp = 1;
        }
        queryString += ")";
    db.query('SELECT [enter shit here once db is up] FROM listing ' + queryString, function(error, results, fields){
        if(error){
            console.log(error);
        }
        var listings = results;
        if (listings) {
          return res.render('results', {listings: listings});
        } else {
            return res.render('results', {message: 'Listings not found!'});
        }
    });
}
else{
    res.send("Please login!");
}
});

app.get("/logout",(req,res)=>{
    req.session.destroy((err) => {
        if(err){
            return  console.error(err)
        }
        console.log("The session has been destroyed!")
        res.redirect("/");
    }) 
});
