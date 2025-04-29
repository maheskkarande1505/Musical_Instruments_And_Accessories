var express = require("express");
var exe = require("./../connection");
var router = express.Router();

router.get("/",async function(req,res){
    res.render("admin/Login.ejs",);
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

router.get("/dashboard", async function(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Get page from URL query, default 1
        const limit = 5; // Number of contacts per page
        const offset = (page - 1) * limit;

        // Fetch limited data
        var sql = `SELECT * FROM contact LIMIT ${limit} OFFSET ${offset}`;
        var data = await exe(sql);

        // Fetch total count for pagination
        var countSql = `SELECT COUNT(*) AS total FROM contact`;
        var countData = await exe(countSql);
        var totalRecords = countData[0].total;
        var totalPages = Math.ceil(totalRecords / limit);

        var obj = {
            contact_info: data,
            currentPage: page,
            totalPages: totalPages
        };

        res.render("admin/Home.ejs", obj);
    } catch (err) {
        console.error(err);
        res.send("Error loading dashboard");
    }
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
});

router.get("/update_personal_info", async function (req, res){
    var sql = `SELECT * FROM update_personal_info`;
    var data = await exe(sql);
    var obj = {"personal_data":data[0]}
    res.render("admin/Personal_info.ejs", obj)
});

router.post("/update_personal_info", async function(req, res) {
   
    var d = req.body;
    var logo = "";
    var id = req.params.id;
    

    if(req.files)
    {
        if(req.files.logo)
        {
            var logo = new Date().getTime()+req.files.logo.name;
            req.files.logo.mv("public/uploads/"+logo);
            var sqlLogo = `UPDATE update_personal_info SET logo = '${logo}'
                                            WHERE info_id = 1 `;
            var datalogo = await exe(sqlLogo);
           // res.send(datalogo);

        }
    }

    var sql = `UPDATE update_personal_info SET 
                   shop_name = '${d.shop_name}',
                   contact_no = '${d.contact_no}',
                   email = '${d.email}',
                   address = '${d.address}',
                   facebook_link = '${d.facebook_link}',
                   insta_link = '${d.insta_link}',
                   twiter_link = '${d.twiter_link}',
                   google_link = '${d.google_link}',
                   youtube_link = '${d.youtube_link}',
                   map_link = '${d.map_link}'
               WHERE info_id = 1`;
   var data =  await exe(sql);

   
   // res.redirect("/admin/update_personal_info?success=true");
   res.redirect("/admin/update_personal_info")

});


router.get("/about_us", async function(req, res){
    var sql = `SELECT * FROM about_us`;
    var data = await exe(sql);
    var obj = {"about_info":data[0]}
    res.render("admin/About.ejs", obj);

});

router.post("/update_about", async function (req, res){

    var d = req.body;
    var about_image = "";
    var id = req.params.id;
    

    if(req.files)
    {
        if(req.files.about_image)
        {
            var about_image = new Date().getTime()+req.files.about_image.name;
            req.files.about_image.mv("public/uploads/"+about_image);
            var sqlabout_image = `UPDATE about_us SET about_image = '${about_image}'
                                            WHERE about_id = 1 `;
            var dataabout_image = await exe(sqlabout_image);
           // res.send(dataabout_image);

        }

        if(req.files.mission_image)
        {
            var mission_image = new Date().getTime()+req.files.mission_image.name;
            req.files.mission_image.mv("public/uploads/"+mission_image);
            var sqlmission_image = `UPDATE about_us SET mission_image = '${mission_image}'
                                            WHERE about_id = 1 `;
            var datamission_image = await exe(sqlmission_image);
           // res.send(datamission_image);

        }

        if(req.files.vission_image)
        {
            var vission_image = new Date().getTime()+req.files.vission_image.name;
            req.files.vission_image.mv("public/uploads/"+vission_image);
            var sqlvission_image = `UPDATE about_us SET vission_image = '${vission_image}'
                                            WHERE about_id = 1 `;
            var datavission_image = await exe(sqlvission_image);
            // res.send(datavission_image);

        }
    }

    var sql = `UPDATE about_us SET 
                   about_us = '${d.about_us}',
                   mission = '${d.mission}',
                   vission = '${d.vission}'
               WHERE about_id = 1`;
   var data =  await exe(sql);

   
   // res.redirect("/admin/update_personal_info?success=true");
   res.redirect("/admin/about_us")
})

// Product page
router.get("/products", function(req, res){
    res.render("admin/Products.ejs")
})

router.post("/add_products",async function(req, res){

    var product_image1 = "";
    var product_image2 = "";
    var product_image3 = "";
    var product_image4 = "";


    if(req.files)
    {
        if(req.files.product_image1)
        {
            product_image1 = new Date().getTime()+req.files.product_image1.name;
            req.files.product_image1.mv("public/uploads/"+product_image1);
        }

        if(req.files.product_image2)
        {
            product_image2 = new Date().getTime()+req.files.product_image2.name;
            req.files.product_image2.mv("public/uploads/"+product_image2);
        }

        if(req.files.product_image3)
        {
            product_image3 = new Date().getTime()+req.files.product_image3.name;
            req.files.product_image3.mv("public/uploads/"+product_image3);
        }

        if(req.files.product_image4)
        {
            product_image4 = new Date().getTime()+req.files.product_image4.name;
            req.files.product_image4.mv("public/uploads/"+product_image4);
        }

    }

    var d = req.body;
    var sql = `INSERT INTO products(product_name,product_price,product_purchase_price,product_details,product_image1,product_image2,product_image3,product_image4) VALUES (?,?,?,?,?,?,?,?)`;
    var data = await exe(sql, [d.product_name,d.product_price,d.product_purchase_price,d.product_details,product_image1,product_image2,product_image3,product_image4])
   // res.send(data);
    res.redirect("/admin/products")
} );

router.get("/product_list",async function(req, res){
    var sql =  `SELECT * FROM products`
    var data = await exe(sql);
    var obj = {"product_info":data}
    res.render("admin/Product_list.ejs",obj)
});

router.get("/delete_product/:id", async function(req, res){
    var id = req.params.id
    var sql = `DELETE FROM products WHERE product_id = '${id}'`;
    var data = await exe(sql);
    //res.send(data);
    res.redirect("/admin/product_list")
});

router.get("/edit_product/:id", async function (req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM products WHERE product_id = '${id}'`;
    var data = await exe(sql);
    var obj = {"products":data[0]};
   // res.send(data)
    res.render("admin/Product_edit.ejs", obj);
});

router.post("/update_product", async function(req, res){
    var id = req.params.id;
    var product_image1 = "";
    var product_image2 = "";
    var product_image3 = "";
    var product_image4 = "";

    var d = req.body;

    if(req.files)
    {
        if(req.files.product_image1)
        {
            var product_image1 = new Date().getTime()+req.files.product_image1.name;
            req.files.product_image1.mv("public/uploads/"+product_image1);
            var sqlImage1 = `UPDATE products SET product_image1 ='${product_image1}'
                                            WHERE product_id = '${d.product_id}' `;
            var dataImage1 = await exe(sqlImage1);

        }
        if(req.files.product_image2)
        {
            var product_image2 = new Date().getTime()+req.files.product_image2.name;
            req.files.product_image2.mv("public/uploads/"+product_image2);
            var sqlImage2 = `UPDATE products SET product_image2 ='${product_image2}'
                                            WHERE product_id = '${d.product_id}' `;
            var dataImage2 = await exe(sqlImage2);

        }
        if(req.files.product_image3)
        {
            var product_image3 = new Date().getTime()+req.files.product_image3.name;
            req.files.product_image3.mv("public/uploads/"+product_image3);
            var sqlImage3 = `UPDATE products SET product_image3 ='${product_image3}'
                                            WHERE product_id = '${d.product_id}' `;
            var dataImage3 = await exe(sqlImage3);

        }
        if(req.files.product_image4)
        {
            var product_image4 = new Date().getTime()+req.files.product_image4.name;
            req.files.product_image4.mv("public/uploads/"+product_image4);
            var sqlImage4 = `UPDATE products SET product_image4 ='${product_image4}'
                                            WHERE product_id = '${d.product_id}' `;
            var dataImage4 = await exe(sqlImage4);

        }
    }

    var sql = `UPDATE products SET
                    product_name = '${d.product_name}',
                    product_price = '${d.product_price}',
                    product_purchase_price = '${d.product_purchase_price}',
                    product_details = '${d.product_details}'
                WHERE product_id = '${d.product_id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/product_list")
});

// Brand Page
router.get("/brand", async function(req, res){
    var sql = `SELECT * FROM brands`
    var data = await exe(sql);
    var obj = {"brand_info":data}
    res.render("admin/Brand.ejs",obj)
});

router.post("/add_brand",async function(req, res){
    var brand_image = "";

    if(req.files)
    {
        if(req.files.brand_image)
        {
            brand_image = new Date().getTime()+req.files.brand_image.name;
            req.files.brand_image.mv("public/uploads/"+brand_image);
        }

    }

    var d = req.body;
    var sql = `INSERT INTO brands(brand_name,brand_image) VALUES (?,?)`;
    var data = await exe(sql, [d.brand_name,brand_image]);
    //res.send(data);
    res.redirect("/admin/brand");
})

router.get("/edit_brand/:id", async function(req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM brands WHERE brand_id = '${id}' `;
    var data = await exe(sql);
    var obj = {"brand_info":data[0]}
    res.render("admin/Brand_Edit.ejs", obj);
});

router.post("/update_brand/", async function(req, res){
    var id = req.params.id;
    var brand_image = "";
    var d = req.body;

    if(req.files)
    {
        if(req.files.brand_image)
        {
            var brand_image = new Date().getTime()+req.files.brand_image.name;
            req.files.brand_image.mv("public/uploads/"+brand_image);
            var sqlImage = `UPDATE brands SET brand_image ='${brand_image}'
                                            WHERE brand_id = '${d.brand_id}' `;
            var dataImage = await exe(sqlImage);

        }
    }

    var sql = `UPDATE brands SET
                    brand_name = '${d.brand_name}'
                WHERE brand_id = '${d.brand_id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/brand")
});

router.get("/delete_brand/:id", async function(req, res){
    var id = req.params.id;
    var sql = `DELETE FROM brands WHERE brand_id = '${id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/brand")
})

// Gallery Page
router.get("/add_photo", async function(req, res){
    var sql = `SELECT * FROM gallery`;
    var data = await exe(sql);
    var obj = {"gallery":data}
    res.render("admin/Gallery.ejs", obj)
});

router.post("/save_photo",async function(req, res){

    var photo = "";

    if(req.files)
    {
        if(req.files.photo)
        {
            photo = new Date().getTime()+req.files.photo.name;
            req.files.photo.mv("public/uploads/"+photo);
        }

    }

    var d = req.body;
    var sql = `INSERT INTO gallery(photo_title,photo) VALUES (?,?)`;
    var data = await exe(sql, [d.photo_title,photo]);
    //res.send(data);
    res.redirect("/admin/add_photo");

});

router.get("/edit_photo/:id", async function(req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM gallery WHERE gallery_id = '${id}' `;
    var data = await exe(sql);
    var obj = {"gallery_info":data[0]}
    res.render("admin/GalleryEdit.ejs", obj);
});

router.post("/update_photo", async function(req, res){
    var id = req.params.id;
    var photo = "";
    var d = req.body;

    if(req.files)
    {
        if(req.files.photo)
        {
            var photo = new Date().getTime()+req.files.photo.name;
            req.files.photo.mv("public/uploads/"+photo);
            var sqlImage = `UPDATE gallery SET photo ='${photo}'
                                            WHERE gallery_id = '${d.gallery_id}' `;
            var dataImage = await exe(sqlImage);

        }
    }

    var sql = `UPDATE gallery SET
                    photo_title = '${d.photo_title}'
                WHERE gallery_id = '${d.gallery_id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/add_photo");
});

router.get("/delete_photo/:id", async function(req, res){
    var id = req.params.id;
    var sql = `DELETE FROM gallery WHERE gallery_id = '${id}'`;
    var data = await exe(sql);
   // res.send(data);
   res.redirect("/admin/add_photo");
});

// Order Details

router.get("/pending_orders", async function(req, res){
    var sql = `SELECT * FROM order_info WHERE order_status = 'Pending'`;
    var data = await exe(sql);
    var obj = {"pending_orders":data};
    res.render("admin/pending_orders.ejs", obj);
});

router.get("/dispatch_orders", async function(req, res){
    var sql = `SELECT * FROM order_info WHERE order_status = 'Dispatch'`;
    var data = await exe(sql);
    var obj = {"dispatch_orders":data};
    res.render("admin/dispatch_orders.ejs", obj);
});  

router.get("/deliverd_orders", async function(req, res){
    var sql = `SELECT * FROM order_info WHERE order_status = 'Deliver'`;
    var data = await exe(sql);
    var obj = {"deliver_orders":data};
    res.render("admin/deliverd_orders.ejs", obj);
});

router.get("/order_details/:order_id", async function(req, res){
    var order_id = req.params.order_id;
    var sql = `SELECT * FROM order_info WHERE order_id = '${order_id}'`;
    var order_info = await exe(sql);

    var sql2 = `SELECT * FROM products, order_products WHERE products.product_id = order_products.product_id 
                        AND order_id = '${order_id}'`;   
    var products = await exe(sql2);
    var obj = {"order_info":order_info[0], "products":products}
    res.render("admin/order_details.ejs", obj);

});

router.get("/change_order_status_to_dispatch/:order_id", async function(req, res){
    var order_id = req.params.order_id;

    var sql = `UPDATE order_info SET order_status = 'Dispatch' WHERE order_id = '${order_id}' `;
    var data = await exe(sql);
   // res.send("Dipatching Order "+ order_id)
    res.redirect("/admin/pending_orders");
});

router.get("/change_order_status_to_deliver/:order_id", async function(req, res){
    var order_id = req.params.order_id;

    var sql = `UPDATE order_info SET order_status = 'Deliver', payment_status = 'Paid' WHERE order_id = '${order_id}' `;
    var data = await exe(sql);
   // res.send("Dipatching Order "+ order_id)
    res.redirect("/admin/dispatch_orders");
});


module.exports = router;