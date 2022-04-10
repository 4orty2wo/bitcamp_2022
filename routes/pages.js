const express=require("express");

const router=express.Router();

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/createAccount",(req,res)=>{
    res.render("createAccount");
});

module.exports = router;