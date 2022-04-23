
var connection = require("./dbconnection")
var constants = require("../config.json");
const jwt = require("jsonwebtoken");

function handle_request(msg, callback){
    // console.log(req.body);
    const password = msg.password;
    const email = msg.email;
    const response = {};
    connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], 
    (err, result) =>{
        if(err){
            response.err = err;
            response.status = 500;
            console.log(err)
            callback(null, response);
            
        }
        if(result.length>0){
            console.log(constants.ACCESS_TOKEN_SECRET)
            const accessToken = jwt.sign(email, constants.ACCESS_TOKEN_SECRET)
            console.log(accessToken)
            response.accessToken = accessToken;
            response.status = 200;
            console.log(result)
            console.log("Login successful")
            callback(null, response);
            // res.send({accessToken: accessToken})
            // res.send(result);
            
        }
        else{
            response.messaage = "Invalid credentials";
            response.status = 404;
            callback(null, response);
            // console.log("Invalid credentials")
        }
    })
};

exports.handle_request = handle_request;