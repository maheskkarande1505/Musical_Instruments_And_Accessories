var express = require("express");
var exe = require("./../connection");
var router = express.Router();

router.get("/",function(req,res){
    res.render("admin/Login.ejs");
});

router.post("/proceed_login", async function(req,res){

    var d = req.body;
    var sql = `SELECT * FROM admin_account WHERE email = ? AND password = ?`;
    var data = await exe(sql,[d.email, d.password]);
    if(data.length > 0)
    {
        var admin_id = data[0].admin_id;
        req.session.admin_id = admin_id;
      // res.send("login Success");
       res.redirect("/admin/dashboard")
    }
    else
    res.send(`
             <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login Failed</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f8d7da;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #721c24;
                    }
                    p {
                        color: #721c24;
                    }
                    a {
                        display: inline-block;
                        margin-top: 15px;
                        padding: 10px 20px;
                        text-decoration: none;
                        background-color: #dc3545;
                        color: white;
                        border-radius: 5px;
                    }
                    a:hover {
                        background-color: #c82333;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Login Failed</h2>
                    <p>Incorrect username or password. Please try again.</p>
                    <a href="/admin">Back to Login</a>
                </div>
            </body>
            </html>
        `);
});

//Logout
router.get("/admin_logout",function(req, res){
    req.session.destroy((err)=>{
        if(err){
            console.error("Error Destroying Session", err);
            return res.status(500).send("Could not log out , plese try again")
        }
        res.redirect("/admin");
    });
});

router.get("/dashboard",function(req, res){
    res.render("admin/Home.ejs")
});

module.exports = router;