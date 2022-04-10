const mysql = require('mysql');
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Client } = require("pg");
const SQL = require('sql-template-strings');
const { request } = require('express');

const db = new Client(process.env.DATABASE_URL);

db.connect();

exports.createAccount = (req,res) => {
    const {fullname, username, password, email} = req.body;

    let search_query = (`SELECT username, email FROM account WHERE username = '${username}' AND email = '${email}'`)
    console.log(search_query)
    db.query(search_query, async (error, results) => {
        console.log(results)
        if (error) {
            console.log(error);
            throw (error);
        }
        if (results.rowCount > 0) {
            return res.render("createAccount",{
                message:"That username or email is already in use"
            })
            

        }
        
        let values = `('${username}', '${email}', '${fullname}', '${password}')`
        const insert_query = "INSERT INTO account VALUES " + values
        console.log(insert_query);
        db.query(insert_query, async (error,results)=>{
            if (error){
                console.log(results);
                console.log(error);
            }
            else{
                console.log(results);
                return res.render("index", {
                    message:"User registered"
                });
            }
        })
    });
}