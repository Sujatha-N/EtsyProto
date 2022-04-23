
var connection = require("./dbconnection")
var constants = require("../config.json");
const jwt = require("jsonwebtoken");

function handle_request(msg, callback){
    // console.log(msg);
    const response = {};

    const token = msg.token;
    const decoded = msg.decoded;
    console.log("decoded in add to favourites API: ", decoded);
    const itemname = msg.itemname
    const itemprice = msg.itemprice
    const itemcurrency = msg.itemcurrency
    const itemid = msg.itemid
    const liked = msg.liked
    const image = msg.image
    
    connection.query("INSERT INTO favourites (itemname,itemprice,itemcurrency,email, itemid, liked, image) VALUES (?,?,?,?,?,?,?)", [itemname,itemprice,itemcurrency,decoded,itemid,liked,image], (err, result)=>{
        if(err){
            response.err = err;
            response.messaage = "Invalid credentials";
            response.status = 404;
            callback(null, response);
        }
        else{
            console.log("Inserted successfully into the favourites table: ",result);
            response.status = 200;
            console.log(result)
            console.log("Inserted successfully into the favourites table")
            callback(null, response);
        }
    })
};

exports.handle_request = handle_request;


