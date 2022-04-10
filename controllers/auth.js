const mysql = require('mysql');
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,  //put ip address if not running on localhost
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.createAccount = (req,res) => {
    const {username, email, fullname, password} = req.body;

    db.query("SELECT username,email FROM account WHERE username=? and email= ?", [username, email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render("createAccount",{
                message: "That username or email is already in use"
            })

        }

        db.query("INSERT INTO account SET ?", {fullname:fullname, username:username, email: email, password: password}, (error,results)=>{
            if (error){
                console.log(results);
                console.log(error);
            }
            else{
                console.log(results);
                return res.render("quiz", {
                    message:"User registered"
                });
            }
        })
    });
}