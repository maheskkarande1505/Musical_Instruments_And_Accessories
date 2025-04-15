var express = require("express");
var exe = require("./../connection");
var router = express.Router()

router.get("/",function(req,res){
    res.render("user/Home.ejs");
});

router.get("/about",function(req,res){
    res.render("user/About.ejs");
});

router.get("/product",function(req,res){
    res.render("user/Product.ejs");
});

router.get("/brand",function(req,res){
    res.render("user/Brand.ejs");
});

router.get("/gallery",function(req,res){
    res.render("user/Gallery.ejs");
});

router.get("/cart",function(req,res){
    res.render("user/Cart.ejs");
});

router.get("/contact",function(req,res){
    res.render("user/Contact.ejs");
});

module.exports = router;