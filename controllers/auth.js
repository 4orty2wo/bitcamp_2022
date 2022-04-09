const mysql = require('mysql');
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,  //put ip address if not running on localhost
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

