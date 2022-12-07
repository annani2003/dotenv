//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
mongoose.connect("mongodb://localhost:27017/usersDB")
const usersSchema = new mongoose.Schema({
  email:String,
  password:String,
})
console.log(process.env.SECRET);
usersSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"] });
const User = new mongoose.model("User", usersSchema)

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.get("/submit",function(req,res){
  res.render("submit");
})
app.get("/logout",function(req,res){
  res.render("login");
})
app.post("/login", function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},function(err,result){
    if (result) {
      console.log(result);
      if (result.password === password) {
          res.render("secrets")
      }

    } else {
      res.send("acount not found")
    }
  })
})


app.post("/register",function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},function(err,result){
    if (result) {
      res.render("secrets");
    console.log("user is already signed up ");
    } else {
      const newRegistration = new User({
        email:email,
        password:password
      })
      newRegistration.save();
      res.render("secrets");
    }
  })
})


















app.listen(3000, function(){
  console.log("server running on port 3000");
})
