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

router.get("/product_details", function(req, res){
    res.render("user/Product_Details.ejs")
});

router.get("/checkout",function(req, res){
    res.render("user/CheckOut.ejs");
});

router.get("/do_payment",function(req, res){
    res.render("user/do_payment.ejs")
});

router.post("/confirm_order",function(req, res){
    res.redirect("/do_payment")
});

router.post("/save_account",async function(req, res){
    var d = req.body;
    var sql = `INSERT INTO user_accounts (user_name, mobile, email, password) VALUES (?,?,?,?)`;
    var data = await exe(sql,[d.user_name,d.mobile,d.email,d.password]);
   // res.send(data);
   res.send("<script> location.href = document.referrer </script>");
});

router.post("/proceed_login", async function(req, res){
    var d = req.body;
    var sql = `SELECT * FROM user_accounts WHERE email = ? AND password = ?`;
    var data = await exe(sql,[d.email, d.password]);
    if(data.length > 0)
    {
        var user_id = data[0].user_id;
        req.session.user_id = user_id;
       // res.send("login Success");
       res.send(`
                    <script> 
                         var url =  document.referrer;
                         var new_url = url.replaceAll('?open_login_modal', '');
                         location.href = new_url;
                    </script>
                    `);
    }
    else
    res.send("login Failed");
});

module.exports = router;