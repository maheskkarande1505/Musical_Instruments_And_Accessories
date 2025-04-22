var express = require("express");
var exe = require("./../connection");
var router = express.Router()

function verify_login(req, res, next)
{
   // req.session.user_id = 1;
    if(req.session.user_id)
        next();
    else
    res.send("<script> location.href = document.referrer+'?open_login_modal' </script> ");
}

function logout(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
       res.send("<script> location.href = document.referrer+'' </script> "); 
    });
}

router.get("/logout", logout, function(req, res){
   // res.send("<script> location.href = document.referrer+'?open_login_modal' </script> ");
});

function is_login(req)
{
    if(req.session.user_id)
        return true;
    else
        return false;
}

router.get("/",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Home.ejs", obj);
});

router.get("/about",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/About.ejs",obj);
});

router.get("/product",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Product.ejs",obj);
});

router.get("/brand",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Brand.ejs",obj);
});

router.get("/gallery",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Gallery.ejs",obj);
});

router.get("/cart",verify_login , function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Cart.ejs",obj);
});

router.get("/contact",function(req,res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Contact.ejs",obj);
});

router.get("/product_details", function(req, res){
    var obj = {"is_login":is_login(req)};
    res.render("user/Product_Details.ejs",obj)
});

router.get("/checkout", verify_login, function(req, res){
    var obj = {"is_login":is_login(req)};
    res.render("user/CheckOut.ejs",obj);
});

router.get("/do_payment",verify_login, function(req, res){
    var obj = {"is_login":is_login(req)};
    res.render("user/do_payment.ejs",obj)
});

router.post("/confirm_order",function(req, res){
    var obj = {"is_login":is_login(req)};
    res.redirect("/do_payment",obj)
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