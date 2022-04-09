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
