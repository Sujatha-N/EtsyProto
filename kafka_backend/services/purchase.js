
var connection = require("./dbconnection")
const jwt = require("jsonwebtoken");

function handle_request(msg, callback){
    // console.log(msg);
    const response = {};

    const token = msg.token;
    const decoded = msg.decoded;
    const itemstotal = msg.itemstotal
    console.log("decoded in POST purchase API: ", decoded);

    connection.query("INSERT INTO purchase (itemstotal,useremailid) VALUES (?,?)", [itemstotal, decoded], (err,result)=>{
        if(err){
            response.err = err;
            response.messaage = "Invalid credentials";
            response.status = 404;
            callback(null, response);
        }
        if(result){
            console.log(result);
            console.log("Inserted Successfully into the purchase table!: ",result);
            response.status = 200;
            callback(null, response);
        }
    })
};

exports.handle_request = handle_request;


