const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
var mysql = require('mysql');
var constants = require("./config.json");
const jwt = require("jsonwebtoken");



var connection = mysql.createPool({
    host: constants.DB.host,
    user:constants.DB.username,
    password:constants.DB.password,
    port:constants.DB.port,
    database:constants.DB.database
});

connection.getConnection((err)=>{
    if(err){
        throw 'Error occured: ' + err;
    }
    console.log("pool created")
});

app.get('/', (req,res) =>{
    res.send("Hello World")
})

app.post("/usersignup",(req,res) =>{
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const image = req.body.image
    
    connection.query("INSERT INTO user (email,username,password,image) VALUES (?,?,?,?)", [email,username,password,image], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Inserted successfully into the user table: " ,result);
            res.status(200).send("Inserted successfully into the user table")
        }
    })
})

app.post("/shopsignup",(req,res) =>{
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    
    connection.query("INSERT INTO shop (owner,email) VALUES (?,?)", [username,email], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Inserted successfully into the shop table: " ,result);
            res.status(200).send("Inserted successfully into the shop table")
        }
    })
})


app.post("/login",(req,res)=>{
    console.log(req.body);
    const password = req.body.password;
    const email = req.body.email;
    connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], 
    (err, result) =>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log(constants.ACCESS_TOKEN_SECRET)
            const accessToken = jwt.sign(email, constants.ACCESS_TOKEN_SECRET)
            console.log(accessToken)
            res.send({accessToken: accessToken})
            // res.send(result);
            console.log(result)
            console.log("Login successful")
        }
        else{
            res.status(404).send({message: "Invalid credentials"})
            console.log("Invalid credentials")
        }
    })
})

// app.post("/profile",(req,res) =>{
//     console.log(req.body);
//     const token = req.header("x-auth-token");
//     const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
//     console.log("decoded: ", decoded);

//     connection.query("SELECT * FROM user WHERE email = ?", [decoded], (err,result)=>{
//         if(err){
//             res.send({err: err});
//             console.log(err)
//         }
//         if(result.length>0){
//             console.log("Result from profile page is:", result[0]);
//             res.send(result[0]);
//         }
//     })

// })

app.post("/editprofile",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST editprofile API : ", decoded);

    connection.query("UPDATE user SET gender = ?, city = ?, about = ?, image=?, dob=?, email=?, phone=?, country=?, address=? where email = ?", [req.body.gender, req.body.city, req.body.about, req.body.image, req.body.dob, req.body.email, req.body.phone, req.body.country, req.body.address, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            res.status(200).send("Updated Successfully !")
        }
    })

})

app.get("/editprofile", (req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET editprofile API: ", decoded);

    connection.query("SELECT * FROM user WHERE email = ?", [decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Edit Profile page is:", result[0]);
            res.send(result[0]);
        }
    })
})

app.get("/shopdetails", (req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET shopdetails API: ", decoded);

    connection.query("SELECT name FROM shop WHERE email = ?", [decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from shop page is:", result[0]);
            res.send(result[0]);
        }
    })
})



app.post("/updateshopimage",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in UPDATE shop image API : ", decoded);

    connection.query("UPDATE shop SET shopimage = ? where email = ?", [req.body.shopimage, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            res.status(200).send("Updated Successfully !")
        }
    })


})



app.post("/edititem", (req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET edit item API: ", decoded);

    connection.query("SELECT * FROM items WHERE id = ?", [req.body.id], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Edit item page is:", result[0]);
            res.send(result[0]);
        }
    })
})

// app.get("/checkedititem", (req,res)=>{
//     const token = req.header("x-auth-token");
//     const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
//     console.log("decoded in get check edit item API: ", decoded);

//     connection.query("SELECT * FROM items WHERE email = ?", [req.body.id], (err,result)=>{
//         if(err){
//             res.send({err: err});
//             console.log(err)
//         }
//         if(result.length>0){
//             console.log("RESULT FROM CHECK EDIT ITEMS IS", result)
//             res.status(200).send("User is the owner")
//         }
//         if(result.length===0){
//             console.log("RESULT FROM CHECK EDIT ITEMS IS", result)
//             res.status(404).send("User is not the owner")
//         }

//     })
// })

// app.get("/getshopname", (req,res)=>{
//     const token = req.header("x-auth-token");
//     const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
//     console.log("decoded in GET editprofile API: ", decoded);

//     connection.query("SELECT * FROM items join shop on items.email = shop.email WHERE email = ?", [decoded], (err,result)=>{
//         if(err){
//             res.send({err: err});
//             console.log(err)
//         }
//         if(result.length>0){
//             console.log("Result from Edit Profile page is:", result[0]);
//             res.send(result[0]);
//         }
//     })
// })



app.post("/updateedititem",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST editprofile API : ", decoded);

    connection.query("UPDATE items SET iname = ?, quantity = ?, price = ?, itemimage = ?, category=?, description=? where id = ?", [req.body.iname, req.body.quantity, req.body.price, req.body.itemimage, req.body.category, req.body.description, req.body.id], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            res.status(200).send("Updated Successfully !")
        }
    })


})



app.post("/changeusername",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST change username API: ", decoded);

    connection.query("UPDATE user SET username = ? where email = ?", [req.body.username, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            res.status(200).send("Updated Successfully !")
        }
    })

})

app.post("/shopdetails",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST shopdetails API: ", decoded);
    console.log("REQUEST.BODY.ID IS", req.body.id)

    if(req.body.id === '0'){

        connection.query("SELECT * FROM items WHERE email = ?", [decoded], (err,result)=>{
            if(err){
                res.send({err: err});
                console.log(err)
            }
            if(result.length>0){
                console.log("Result from TSC is:", result);
                connection.query("SELECT SUM(salescount) as salescount FROM items WHERE email = ?", [decoded], (errr,resultt)=>{
                    if(errr){
                        res.send({errr: errr});
                        console.log(errr)
                    }
                    if(result.length>0){
                        console.log("Result from TOTAL SALES COUNT is:", resultt[0].salescount);
                        let salescount = resultt[0].salescount
                        console.log("DECODED FOR TESTING IS", decoded)

                        connection.query("SELECT shopimage FROM shop where email = ?", [decoded], (errrr,resulttt)=>{
                            if(errrr){
                                res.send({errrr: errrr});
                                console.log(errrr)
                            }
                            if(resulttt){
                                console.log("SHOP IMAGE IS", resulttt.shopimage)
                                let shopimage = resulttt.shopimage;
                                res.send({result:result, email:decoded, salescount:salescount, shopimage: shopimage});
                            }
                        })
                    }
                })
            }
        })
        
    }
    else{
        connection.query("SELECT shopname FROM items where id = ?", [req.body.id],(err,result)=>{
            if(err){
                res.send({err: err});
                console.log(err)
            }
            if(result.length>0){
                console.log("Result from Get shop details API is:", result[0]);
                const shopname = result[0].shopname;
    
                connection.query("SELECT * FROM items where shopname = ?", [shopname],(err,result)=>{
                    if(err){
                        res.send({err: err});
                        console.log(err)
                    }
                    if(result.length>0){
                        console.log("Result from items Get shop details API is:", result[0]);
                        connection.query("SELECT SUM(salescount) as salescount FROM items WHERE shopname = ?", [shopname], (errr,resultt)=>{
                            if(errr){
                                res.send({errr: errr});
                                console.log(errr)
                            }
                            if(result.length>0){
                                console.log("Result from TOTAL SALES COUNT is:", resultt[0].salescount);
                                let salescount = resultt[0].salescount
                                connection.query("SELECT shopimage FROM shop where email = ?", [decoded], (errrr,resulttt)=>{
                                    if(errrr){
                                        res.send({errrr: errrr});
                                        console.log(errrr)
                                    }
                                    if(resulttt){
                                        console.log("SHOP IMAGE IS", resulttt)
                                        let shopimage = resulttt;
                                        res.send({result:result, email:decoded, salescount:salescount, shopimage: resulttt});
                                    }
                                })
                            }
                        })
                    }
                })
    
            }
        })

    }

})

app.get("/shopdetailspage",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET shopdetails page API: ", decoded);

    connection.query("SELECT * FROM shop JOIN user ON shop.email = user.email JOIN items ON items.email = shop.email where user.email = ?", [decoded],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Get shop details page API is:", result[0]);
            res.send(result[0]);
        }
    })

})


app.get("/listofitems",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET list of items page API: ", decoded);

    // LEFT JOIN favourites ON items.id = favourites.itemid
    
    connection.query("SELECT * FROM items",(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from dashboard list of items page API is:", result);
            res.send(result);
        }
    })

})

app.get("/likeditems",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in liked items API: ", decoded);

    connection.query("SELECT * FROM favourites where email = ?", [decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            console.log("LIKED ITEMS IN DASHBOARD IS", result)
            res.status(200).send(result)
        }
    })

})



app.get("/instockitems",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in instock items API: ", decoded);

    connection.query("SELECT * FROM items where quantity>0 ", (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            console.log("Instock items result is", result)
            res.status(200).send(result)
        }
    })

})





app.post("/checkshopname",(req,res)=>{
    console.log(req.body);

    connection.query("SELECT * FROM shop WHERE name = ?",[req.body.name], (err,result)=>{
        if(err){
            res.send({err: err})
            console.log(err)
        }
        if(result.length>0){
            console.log("inside check shop name")
            console.log("Shop Name Already exists");
            res.status(404).send("Shop Name already exists")
        }
        if(result.length===0){
            console.log("Shop Name is available");
            res.status(200).send("Shop Name is available")
        }
    })
})

app.post("/updateshopname",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST update shop name API: ", decoded);

    connection.query("UPDATE shop SET name = ? where email = ?", [req.body.name, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            connection.query("UPDATE items SET shopname = ? where email = ?", [req.body.name, decoded], (err,result)=>{
                if(err){
                    res.send({err: err});
                    console.log(err)
                }
                if(result){
                    res.status(200).send("Updated Successfully !")
                }
            })
        }
    })
})

app.post("/additem",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST update shop name API: ", decoded);

    connection.query("SELECT iname FROM items WHERE email = ? AND iname = ?", [decoded, req.body.itemname], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        console.log(result.length)
        if(result.length===0){
            console.log("Inside adding the item")

            connection.query("SELECT name from SHOP WHERE email = ?", [decoded], (err,result)=>{
                if(err){
                    res.send({err: err});
                    console.log(err)
                }
                if(result){
                    const shopname = result
                    connection.query("INSERT INTO items (owner,iname, quantity, price_currency, price, email, itemimage, shopname, category, description) VALUES (?,?,?,?,?,?,?,?,?,?)", [req.body.owner,req.body.itemname, req.body.quantity,req.body.price_currency,req.body.price,decoded, req.body.itemimage, shopname, req.body.category, req.body.description], (err,result)=>{
                        if(err){
                            res.send({err: err});
                            console.log(err)
                        }
                        if(result){
                            console.log("Item added successfully")
                            res.status(200).send("Item is added successfully")
                        }
                        
                    })

                }
            })
        }
        if(result.length>0){
            console.log("Item name already exists")
            res.status(404).send("Item name already exists");
        }
    })
})

app.post("/itemdescription",(req,res)=>{
    console.log("Item description body is ",req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in item description API: ", decoded);

    connection.query("SELECT * FROM items join shop on items.email = shop.email WHERE id = ?", [req.body.id],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            console.log("Response from ITEM DESCRIPTION POST API is", result)
            res.status(200).send(result[0]);
        }
    })

})

app.post("/addtofavourites",(req,res) =>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in add to favourites API: ", decoded);
    const itemname = req.body.itemname
    const itemprice = req.body.itemprice
    const itemcurrency = req.body.itemcurrency
    const itemid = req.body.itemid
    const liked = req.body.liked
    const image = req.body.image
    
    connection.query("INSERT INTO favourites (itemname,itemprice,itemcurrency,email, itemid, liked, image) VALUES (?,?,?,?,?,?,?)", [itemname,itemprice,itemcurrency,decoded,itemid,liked,image], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Inserted successfully into the favourites table: " ,result);
            res.status(200).send("Inserted successfully into the favourites table")
        }
    })
})

app.post("/removefromfavourites",(req,res) =>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in remove from favourites API: ", decoded);
    const itemid = req.body.itemid

    
    connection.query("DELETE FROM favourites WHERE itemid = ? AND email = ?", [itemid,decoded], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Deleted successfully from the favourites table: " ,result);
            res.status(200).send("Deleted successfully from the favourites table")
        }
    })
})


app.get("/favourites",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET favourites page API: ", decoded);

    connection.query("SELECT * FROM favourites where email = ?", [decoded],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Get favourites page API is:", result[0]);
            res.send(result);
        }
    })
})

app.post("/favouritesid",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET favourites id page API: ", decoded);

    connection.query("SELECT liked FROM favourites where email = ? AND itemid = ?", [decoded, req.body.itemid],(err,result)=>{

        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Get favourites page API is:", result[0]);
            res.send(result[0]);
        }
        if(result.length===0){
            console.log("Not in favourites");
            res.send('no')
        }
    })
})

app.post("/profilepic",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST update shop name API: ", decoded);

    connection.query("UPDATE user SET image = ? where email = ?", [req.body.image, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            res.status(200).send("Updated Successfully !")
        }
    })
})

app.post("/purchase",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST purchase API: ", decoded);

    connection.query("INSERT INTO purchase (itemstotal,useremailid) VALUES (?,?)", [req.body.itemstotal, decoded], (err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result){
            console.log(result);
            res.status(200).send("Inserted Successfully!")
        }
    })

})

app.get("/purchase",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET purchases page API: ", decoded);

    connection.query("SELECT * FROM purchase where useremailid = ?", [decoded],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Get purchase page API is:", result);
            res.status(200).send(result);
        }
    })
})

app.post("/orders",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST orders API: ", decoded);
    let orderid = 0;


    connection.query("SELECT * FROM purchase where useremailid = ? ORDER BY purchasedate desc", [decoded],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            orderid = result[0].id;
            console.log("ID from purchases table is",orderid)
            connection.query("INSERT INTO orders (orderid,ordername,orderquantity,orderprice,orderitemid, orderimage) VALUES (?,?,?,?,?,?)", [orderid,req.body.ordername, req.body.orderquantity, req.body.orderprice, req.body.orderitemid, req.body.orderimage], (err,result)=>{
                if(err){
                    res.send({err: err});
                    console.log(err)
                }
                if(result){
                    console.log(result);
                    res.status(200).send("Inserted Successfully!")
                }
            })
        }
        if(result.length===0){
            res.send("No purchases done")
        }
    })


    

})

app.post("/orderid",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET orders page API: ", decoded);

    connection.query("SELECT * FROM orders join items on orders.orderitemid = items.id where orderid = ?", [req.body.orderid],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from Get orders page API is:", result);
            res.send(result);
        }
    })
})

app.post("/updatequantity",(req,res)=>{
    console.log(req.body);
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST update quantity API: ", decoded);
    let updatequantity = null ;

    connection.query("SELECT orderquantity FROM orders where orderitemid = ?", [req.body.orderitemid],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result for quantity from orders is:", result[0].orderquantity);
            connection.query("SELECT quantity FROM items where id = ?", [req.body.orderitemid],(error,resultnew)=>{
                if(error){
                    res.send({error: error});
                    console.log(error)
                }
                if(resultnew.length>0){
                    console.log("Result for quantity from items is:", resultnew[0].quantity);
                    updatequantity = resultnew[0].quantity - result[0].orderquantity
                    console.log("NEW QUANTITY IS", updatequantity)
                    connection.query("UPDATE items SET quantity = ? where id = ?", [updatequantity, req.body.orderitemid], (errr,resultt)=>{
                        if(errr){
                            res.send({errr: errr});
                            console.log(errr)
                        }
                        if(resultt){
                            let salescount = result[0].orderquantity
                            connection.query("UPDATE items SET salescount = ? where id = ?", [salescount, req.body.orderitemid], (errrr,resulttt)=>{
                                if(errrr){
                                    res.send({errr: errr});
                                    console.log(errr)
                                }
                                if(resulttt){
                                    res.status(200).send("Updated quantity and salescount Successfully !")
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    
})

app.get("/itemslist",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in GET list of items page API: ", decoded);

    // LEFT JOIN favourites ON items.id = favourites.itemid

    connection.query("SELECT * FROM items where email = ?",[decoded],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from shop items list page API is:", result);
            res.send(result);
        }
    })

})

app.post("/pricerange",(req,res)=>{
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
    console.log("decoded in POST price range page API: ", decoded);

    connection.query("SELECT * FROM items where price>= ? AND price <=?", [req.body.min, req.body.max],(err,result)=>{
        if(err){
            res.send({err: err});
            console.log(err)
        }
        if(result.length>0){
            console.log("Result from POST price range page API is:", result);
            res.send(result);
        }
    })
})


app.listen(4000, ()=>{
    console.log('Server listening on port 4000');
});