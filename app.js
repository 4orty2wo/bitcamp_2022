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
var pg = require("pg");
var fs = require("fs");
const { Client } = require("pg");

dotenv.config({path: './.env'})

// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST, 
//     user: process.env.DATABASE_USER,
//     password:process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE,
// });

// Connection to the database

const db = new Client(process.env.DATABASE_URL);

db.connect(function (err, db, done) {

    // Close the connection to the database and exit
    var finish = function () {
        done();
        process.exit();
    };

    if (err) {
        console.error('Error connecting to the CockroachDB', err);
        finish();
    }
});
  
const publicDirectory = path.join(__dirname, "./public")
app.use(express.static(publicDirectory))


app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.set("view engine", "hbs");

// db.connect((error)=> {
//     if(error) {
//         console.log(error)
//     }
//     else{
//         console.log("MY SQL Connected..")
//     }
// })

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
    const {username, password} = req.body;
    if (username && password) {
        db.query(`SELECT username,password FROM account WHERE username = '${username}' AND password = '${password}'`, function(error, results, fields) {
            if (results.rowCount > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect("/quiz");
            }
            else{   
                return res.render("index",{
                message: "Incorrect Username and/or Password"
                });
            }
        });
    }
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
    if (req.session.loggedin){
<<<<<<< Updated upstream
        var queryString = "WHERE rooms = '" + rooms + "' AND bathrm = '" + bathrooms + "' AND source IN ('";
        if(residential==1){
            temp = 1;
        }
        if(condominium==1){
            temp2 = 1;
            if(temp==1){
<<<<<<< Updated upstream
                queryString += "', 'codominium')";
            }
            else{
                queryString += "condominium')";
            }
        }
        if(temp2==0){
            queryString += "')";
        }
        if(units==0){
            queryString += " AND num_units = '1";
        }
<<<<<<< Updated upstream
            queryString += " AND zipcode = '" + zipcode;
        
        queryString += "' AND condition IN ";
        if(poorCond==1){
            queryString += "(1, 2, 3, 4, 5, 6)";
        }
            queryString += "(2, 3, 4, 5, 6)";
        }
            queryString += "(3, 4, 5, 6)";   
        }
            queryString += "(4, 5, 6)";      
        }
            queryString += "(5, 6)";
        }
            queryString += "(6)";
        }
    db.query('SELECT fulladdress, rooms, bathrm, num_units, zipcode, source, condition FROM staging ' + queryString, function(error, results, fields){
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
