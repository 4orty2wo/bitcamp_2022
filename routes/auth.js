const express=require("express");
const authController=require("../controllers/auth")
const router=express.Router();

router.post("/createAccount", authController.createAccount)
module.exports = router;