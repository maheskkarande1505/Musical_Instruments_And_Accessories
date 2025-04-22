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

router.get("/slider",async function(req, res){
    var sql =  `SELECT * FROM slider`;
    var data = await exe(sql);
    var obj = {"slider_info":data}
    res.render("admin/Slider.ejs", obj);
});

router.post("/add_slider", async function(req, res){
    var slider_image = "";

    if(req.files)
    {
        if(req.files.slider_image)
        {
            slider_image = new Date().getTime()+req.files.slider_image.name;
            req.files.slider_image.mv("public/uploads/"+slider_image);
        }

    }

    var d = req.body;
    var sql = `INSERT INTO slider(slider_title,slider_image,slider_desc) VALUES (?,?,?)`;
    var data = await exe(sql, [d.slider_title,slider_image,d.slider_desc]);
    //res.send(data);
    res.redirect("/admin/slider");
});

router.get("/edit_slider/:id", async function(req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM slider WHERE slider_id = '${id}' `;
    var data = await exe(sql);
    var obj = {"slider_info":data[0]}
    res.render("admin/Slider_Edit.ejs", obj);
});

router.post("/update_slider/", async function(req, res){
    var id = req.params.id;
    var slider_image = "";
    var d = req.body;

    if(req.files)
    {
        if(req.files.slider_image)
        {
            var slider_image = new Date().getTime()+req.files.slider_image.name;
            req.files.slider_image.mv("public/uploads/"+slider_image);
            var sqlImage = `UPDATE slider SET slider_image ='${slider_image}'
                                            WHERE slider_id = '${d.slider_id}' `;
            var dataImage = await exe(sqlImage);

        }
    }

    var sql = `UPDATE slider SET
                    slider_title = '${d.slider_title}',
                    slider_desc = '${d.slider_desc}'
                WHERE slider_id = '${d.slider_id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/slider")
});

router.get("/delete_slider/:id", async function(req, res){
    var id = req.params.id;
    var sql = `DELETE FROM slider WHERE slider_id = '${id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/slider")
})

router.get("/about_us",function(req, res){
    res.render("admin/About.ejs");
})

module.exports = router;